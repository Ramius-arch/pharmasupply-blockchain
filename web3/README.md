# Supply Chain DApp

This directory contains a simple supply chain decentralized application (DApp).

## Components

- **Smart Contract:** `contracts/SupplyChain.sol` - A Solidity smart contract for tracking items in a supply chain.
- **Deployment Script:** `scripts/deploy.js` - A script to deploy the smart contract to a local Hardhat network.
- **Tests:** `test/SupplyChain.test.js` - Tests for the smart contract.
- **Frontend:** `index.html` and `frontend.js` - A simple frontend for interacting with the smart contract.

## How to Run

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start a Local Hardhat Node:**
   ```bash
   npx hardhat node
   ```
   This will start a local Ethereum node for development.

3. **Deploy the Contract:**
   In a separate terminal, run the following command to deploy the `SupplyChain` contract:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```
   This will deploy the contract and create a `contract-address.json` file with the contract's address and ABI.

4. **Start a Web Server:**
   You need to serve the `index.html` and `frontend.js` files. A simple way to do this is using Python's built-in HTTP server. In the `web3/` directory, run:
   ```bash
   python -m http.server
   ```
   If you don't have Python, you can use any other simple web server. For example, with Node.js, you can install `http-server` (`npm install -g http-server`) and then run `http-server`.

5. **Use the DApp:**
   - Open a web browser and go to `http://localhost:8000` (or the appropriate address if you're using a different server or port).
   - Make sure you have a web3 wallet like MetaMask installed in your browser.
   - Connect your wallet to the local Hardhat network (Chain ID: 31337).
   - You can now interact with the DApp to create items, get their status, and update their status.
