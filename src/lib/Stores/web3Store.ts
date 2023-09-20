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
  signer?: Signer;
  contractAddress: string;
}>(

);

export { web3Data };
