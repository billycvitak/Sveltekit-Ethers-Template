<script lang="ts">
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import { web3Data } from '$lib/Stores/web3Store';

	let connecting = false;
	let connected = false;
	let error = '';

	async function initializeWeb3Provider() {
		try {
			if (window.ethereum) {
				connecting = true;

				const provider = new ethers.providers.Web3Provider(window.ethereum);

				await window.ethereum.request({ method: 'eth_requestAccounts' });

				const network = await provider.getNetwork();
				const signer = provider.getSigner();
				const address = await signer.getAddress();
				const balance = await provider.getBalance(address);

				web3Data.update((data) => ({
					...data,
					provider: provider,
					network: network,
					address: address,
					balance: balance,
					signer: signer,
					connecting: false,
					connected: true
				}));

				connected = true;
			} else {
				error = 'Please install MetaMask.';
			}
		} catch (err: any) {
			error = err.reason || err.message || 'An error occurred.';
		} finally {
			connecting = false;
			fetchBalance();
		}
	}

	let formattedBalance: string;

	async function fetchBalance() {
		if (!$web3Data.provider || !$web3Data.address) {
			return undefined;
		}
		const balanceWei = await $web3Data.provider.getBalance($web3Data.address);
		const balanceInEther = ethers.utils.formatUnits(balanceWei, 'ether');
		formattedBalance = parseFloat(balanceInEther).toFixed(4);
		return formattedBalance;
	}

	async function disconnectWeb3Provider() {
		try {
			if (window.ethereum) {
				await window.ethereum.request({
					method: 'eth_requestAccounts',
					params: [{ eth_accounts: [] }]
				});

				web3Data.set({
					contractAddress: '',
					connecting: false,
					connected: false
				});
				connected = false;
			}
		} catch (err) {
			console.error('Error disconnecting:', err);
		}
	}

	onMount(() => {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', async (accounts: any) => {
				console.log('Accounts changed:', accounts);
				initializeWeb3Provider();
			});

			window.ethereum.on('chainChanged', async (chainId: any) => {
				console.log('Chain changed:', chainId);
				initializeWeb3Provider();
			});
		}
	});
</script>

<div class="w-1/2 mx-auto bg-black/50 text-white/50 my-8 border border-stone-500/50">
	<h2>Web3 Account Login/Store</h2>
	{#if connecting}
		<p>Connecting...</p>
	{:else if connected}
		<p>Connected Account:</p>
		<ul>
			<li><strong>Address:</strong> {$web3Data.address}</li>
			<li><strong>Network:</strong> {$web3Data.network?.name}</li>
			<li><strong>Balance:</strong> {formattedBalance} ETH</li>
		</ul>
		<button on:click={disconnectWeb3Provider}>Disconnect</button>
	{:else}
		<p>{error}</p>
		<button on:click={initializeWeb3Provider}>Connect</button>
	{/if}
</div>
