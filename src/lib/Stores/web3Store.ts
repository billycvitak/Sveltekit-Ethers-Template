import { writable } from 'svelte/store';
import type { Web3Provider } from '@ethersproject/providers';
import type { Network } from '@ethersproject/networks';
import type { Signer } from 'ethers';
import type { ethers } from 'ethers';

const web3Data = writable<{
  provider?: Web3Provider;
  network?: Network;
  address?: string;
  balance?: ethers.BigNumber;
  formattedBalance: string;
  signer?: Signer;
  contractAddress: string;
  connecting: boolean;
  connected: boolean;
  error: any;
}>({
  contractAddress: '',
  connecting: false,
  connected: false,
  error: '',
  formattedBalance: '0.0000',
});

export { web3Data };
