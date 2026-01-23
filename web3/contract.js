import { ethers } from 'ethers';
import { getSigner, provider } from './provider';

// Function to deploy a new contract instance (for development only!)
export async function deployContract(abi, constructorArgs) {
  const signer = await getSigner();
  const Contract = new ethers.Contract(null, abi, signer);
  const tx = await Contract.deploy(...constructorArgs).wait();

  console.log(`Contract deployed at: ${tx.contractAddress}`);
  return { address: tx.contractAddress, abi };
}

// Function to get an existing contract instance
export function getContractInstance(address, abi) {
  if (!address || !abi) throw new Error('Missing required parameters');
  return new ethers.Contract(address, abi, provider);
}
