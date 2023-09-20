<script lang="ts">
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import { web3Data } from '$lib/Stores/web3Store';

	let formattedBalance = '0.0000';

	$: {
		const balanceWei = $web3Data.balance;
		if (balanceWei) {
			const balanceInEther = ethers.utils.formatUnits(balanceWei, 'ether');
			formattedBalance = parseFloat(balanceInEther).toFixed(4);
		}
	}

	async function initializeWeb3Provider() {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				throw new Error('Please install MetaMask.');
			}

			web3Data.update((data) => ({ ...data, connecting: true }));

			const provider = new ethers.providers.Web3Provider(ethereum);
			await ethereum.request({ method: 'eth_requestAccounts' });

			const network = await provider.getNetwork();
			const signer = provider.getSigner();
			const address = await signer.getAddress();

			const balanceWei = await provider.getBalance(address);
			const balance = balanceWei ? balanceWei : ethers.constants.Zero;

			web3Data.set({
				provider,
				network,
				address,
				balance,
				signer,
				connecting: false,
				connected: true,
				error: '',
				contractAddress: ''
			});
		} catch (err: any) {
			web3Data.update((data) => ({
				...data,
				connecting: false,
				connected: false,
				error: err.reason || err.message || 'An error occurred.'
			}));
		}
	}

	export async function disconnectWeb3Provider() {
		try {
			const { ethereum } = window;
			if (ethereum) {
				await ethereum.request({
					method: 'eth_requestAccounts',
					params: [{ eth_accounts: [] }]
				});

				web3Data.set({
					contractAddress: '',
					connecting: false,
					connected: false,
					error: ''
				});
			}
		} catch (err) {
			console.error('Error disconnecting:', err);
		}
	}

	onMount(() => {
		const { ethereum } = window;
		if (ethereum) {
			ethereum.on('accountsChanged', () => {
				console.log('Accounts changed');
				initializeWeb3Provider();
			});

			ethereum.on('chainChanged', () => {
				console.log('Chain changed');
				initializeWeb3Provider();
			});
		}
	});
</script>

<slot />
<div class="w-1/2 text-center mx-auto bg-black/50 text-white/50 my-8 border border-stone-500/50">
	<h2>Web3 Account Login/Store</h2>
	{#if $web3Data.connecting}
		<p>Connecting...</p>
	{:else if $web3Data.connected}
		<p>Connected Account:</p>
		<ul>
			<li><strong>Address:</strong> {$web3Data.address}</li>
			<li><strong>Network:</strong> {$web3Data.network?.name}</li>
			<li><strong>Balance:</strong> {formattedBalance} ETH</li>
		</ul>
		<button on:click={disconnectWeb3Provider}>Disconnect</button>
	{:else}
		<p>{$web3Data.error}</p>
		<button on:click={initializeWeb3Provider}>Connect</button>
	{/if}
</div>
