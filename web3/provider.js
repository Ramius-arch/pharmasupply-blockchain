import { ethers } from 'ethers';

const networkId = 5; // ID for Ganache/Hardhat (local dev networks)
const rpcUrl = 'http://localhost:8545'; // Default URL for local nodes

// Connect to the blockchain provider
export const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

provider.on('connect', () => {
  console.log('Connected to blockchain network');
});

// Verify we're on the correct network (important for security)
async function checkNetwork() {
  const currentId = await provider.getNetwork().then((net) => net.chainId);
  if (currentId !== networkId) {
    throw new Error(`Incorrect network connected. Expected ${networkId}, got ${currentId}`);
  }
}

checkNetwork(); // Run this when the application starts

// Function to get a signer for transactions
export async function getSigner() {
  return await provider.getSigner();
}
