const fs = require('fs');
const path = require('path');
const env = require('./env');

function loadContractFromFile() {
  const contractAddressPath = path.join(__dirname, '..', '..', 'web3', 'contract-address.json');
  if (fs.existsSync(contractAddressPath)) {
    const rawData = fs.readFileSync(contractAddressPath);
    const data = JSON.parse(rawData);
    return { address: data.address, abi: data.abi };
  }
  return { address: undefined, abi: undefined };
}

// Environment variables take precedence over the local contract-address.json file.
const fromEnv = {
  address: env.BLOCKCHAIN_CONTRACT_ADDRESS,
  abi: env.BLOCKCHAIN_CONTRACT_ABI ? JSON.parse(env.BLOCKCHAIN_CONTRACT_ABI) : undefined
};

const fromFile = loadContractFromFile();

module.exports = {
  SUPPLY_CHAIN_CONTRACT_ADDRESS: fromEnv.address || fromFile.address,
  SUPPLY_CHAIN_CONTRACT_ABI: fromEnv.abi || fromFile.abi
};
