const fs = require('fs');
const path = require('path');

const contractAddressPath = path.join(__dirname, '..', '..', 'web3', 'contract-address.json');
let contractAddress;
let contractABI;

if (fs.existsSync(contractAddressPath)) {
    const rawData = fs.readFileSync(contractAddressPath);
    const data = JSON.parse(rawData);
    contractAddress = data.address;
    contractABI = data.abi;
}

module.exports = {
    SUPPLY_CHAIN_CONTRACT_ADDRESS: contractAddress,
    SUPPLY_CHAIN_CONTRACT_ABI: contractABI
};
