<script>
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

<div>
	<p>Connection Status: {connectionStatus}</p>
</div>
