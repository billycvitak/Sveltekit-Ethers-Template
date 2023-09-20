Web3 Account Login/Store with Svelte
This Svelte-based web application allows users to connect to their Ethereum accounts using MetaMask and displays their account information, including address, network, and balance. Users can also disconnect their account when needed.

Features
Connect to MetaMask Ethereum accounts.
Display user account information, including address, network, and balance.
Disconnect from the connected account.
Automatically handle account and chain changes.
Code Explanation
The code is written in TypeScript and uses the Svelte framework along with the ethers.js library for Ethereum interactions. Here's a brief explanation of key components:

initializeWeb3Provider()
This function initializes the Web3 provider using MetaMask if it's available. It requests account access, retrieves network information, user address, and balance. The obtained data is then stored in the web3Data store, and the user is marked as connected.

fetchBalance()
This function fetches the user's account balance in Ether. It checks if the provider and address are available, and if so, it converts the balance from Wei to Ether and formats it with four decimal places.

disconnectWeb3Provider()
This function allows the user to disconnect their Web3 account. It sends a request to MetaMask to disconnect and clears the web3Data store, marking the user as disconnected.

onMount()
This part of the code runs when the component is mounted. It listens for changes in the user's Ethereum accounts and the Ethereum chain. When these changes occur, it calls initializeWeb3Provider() to update the data.

Usage
Ensure you have MetaMask installed in your browser.
Open this Svelte app and click the "Connect" button to connect your MetaMask account.
If connected, your account information will be displayed, including address, network, and balance.
You can click the "Disconnect" button to disconnect your account.
