import { ethers } from 'ethers';

// Format an address for display (shortened version)
export function formatAddress(address) {
  if (!address) return '0x0000...0000';
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}

// Convert between human-readable numbers and wei units
export function toWei(value, unit = 'ether') {
  switch (unit) {
    case 'wei': return value;
    case 'kwei': return value * 1000;
    case 'mwei': return value * 1000000;
    case 'gwei': return value * 1000000000;
    case 'ether': return value * 1000000000000000000;
    default: throw new Error('Invalid unit');
  }
}

// Generate a random address (for testing purposes)
export function generateRandomAddress() {
  return ethers.utils.sha3('hello' + Math.random()).substring(2, 20);
}

// Generate a new Ethereum wallet (address and private key)
export function generateWallet() {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

