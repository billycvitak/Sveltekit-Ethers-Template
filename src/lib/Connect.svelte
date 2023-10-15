<script lang="ts">
	import { onMount } from 'svelte';
	import { ethers } from 'ethers';
	import { web3Data } from '$lib/Stores/web3Store';

	$: {
		const balanceWei = $web3Data.balance;
		if (balanceWei) {
			const balanceInEther = ethers.utils.formatUnits(balanceWei, 'ether');
			$web3Data.formattedBalance = parseFloat(balanceInEther).toFixed(4);
		}
	}

	async function initializeWeb3Provider() {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				throw new Error("Please install MetaMask.");
			}

			web3Data.update((data) => ({ ...data, connecting: true }));

			const provider = new ethers.providers.Web3Provider(ethereum);
			await ethereum.request({ method: "eth_requestAccounts" });

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
				error: "",
				contractAddress: "",
				formattedBalance: "",
			});
			fetchPlayerInfo();
			fetchHiveInfo();
		} catch (err: any) {
			web3Data.update((data) => ({
				...data,
				connecting: false,
				connected: false,
				error: err.reason || err.message || "An error occurred.",
			}));
		}
	}

	async function disconnectWeb3Provider() {
		try {
			const { ethereum } = window;
			if (ethereum) {
				await ethereum.request({
					method: "eth_requestAccounts",
					params: [{ eth_accounts: [] }],
				});

				web3Data.set({
					contractAddress: "",
					connecting: false,
					connected: false,
					error: "",
					formattedBalance: "",
				});
			}
		} catch (err) {
			console.error("Error disconnecting:", err);
		}
	}

	onMount(() => {
		const { ethereum } = window;
		if (ethereum) {
			ethereum.on("accountsChanged", () => {
				console.log("Accounts changed");
				web3Data.update((data) => ({
					...data,
					connecting: false,
					connected: false,
				}));
				location.reload();
			});

			ethereum.on("chainChanged", () => {
				console.log("Chain changed");
				web3Data.update((data) => ({
					...data,
					connecting: false,
					connected: false,
				}));
				location.reload();
			});
		}
	});
</script>

<div class="w-1/2 text-center mx-auto bg-black/50 text-white/50 my-8 border border-stone-500/50">
	<h2 class="font-bold">Web3 Account Login/Store</h2>
	{#if $web3Data.connected}
		<button
			class="py-2 px-2 m-2 rounded-lg bg-white/20 border border-black/50"
			on:click={disconnectWeb3Provider}>Disconnect</button
		>
	{:else}
		<p>{$web3Data.error}</p>
		<button
			class="py-2 px-2 m-2 rounded-lg bg-white/20 border border-black/50"
			on:click={initializeWeb3Provider}>Connect</button
		>
	{/if}
</div>
<slot />
