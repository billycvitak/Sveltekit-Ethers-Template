import { writable } from 'svelte/store';
import type { Web3Provider } from '@ethersproject/providers';
import type { Network } from '@ethersproject/networks';
import type { Signer } from 'ethers';
import { ethers } from 'ethers';

const web3Data = writable<{
  provider?: Web3Provider;
  network?: Network;
  address?: string;
  balance?: ethers.BigNumber;
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
  balance: ethers.constants.Zero,
});

export { web3Data };
