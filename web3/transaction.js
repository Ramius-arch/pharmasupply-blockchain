import { ethers } from 'ethers';
import { getSigner, provider } from './provider';

// Function to send a transaction (ETH or tokens)
export async function sendTransaction(from, to, value = 0, gasLimit = 21000, data = '') {
  try {
    const signer = await getSigner();
    const tx = await signer.sendTransaction({
      from: from,
      to: to,
      value: ethers.utils.parseEther(value).toString(), // Convert to wei
      gasLimit: gasLimit,
      data: data // Contract call data (optional)
    });

    console.log(`Sending transaction: ${tx.hash}`);
    return tx;
  } catch (error) {
    throw new Error(`Transaction failed: ${error.message || error}`);
  }
}

// Function to estimate gas for a contract call
export async function estimateGas(from, to, value = 0, data = '') {
  const signer = await getSigner();
  return await signer.estimateGas({
    from: from,
    to: to,
    value: ethers.utils.parseEther(value).toString(),
    data: data
  });
}
