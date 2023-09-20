<script lang="ts">
	import { web3Data } from '$lib/Stores/web3Store';

	let connectionStatus = '';

	$: {
		const isConnecting = $web3Data.connecting;
		const isConnected = $web3Data.connected;

		if (isConnecting) {
			connectionStatus = 'Connecting...';
		} else if (isConnected) {
			connectionStatus = 'Connected';
		} else {
			connectionStatus = 'Not Connected';
		}
	}
</script>

{#if $web3Data.connecting || !$web3Data.connected}
	<div class="text-center">
		<p>Connection Status: {connectionStatus}</p>
	</div>
{:else}
	<div class="text-center">
		<p>Connection Status: {connectionStatus}</p>
		<p class="text-bold italic">Hello {$web3Data.address}</p>

		<ul>
			<li><strong>Network:</strong> {$web3Data.network?.name}</li>
			<li><strong>Balance Formatted:</strong> {$web3Data?.formattedBalance} ETH</li>
			<li><strong>Balance:</strong> {$web3Data?.balance} ETH</li>
		</ul>
	</div>
{/if}
