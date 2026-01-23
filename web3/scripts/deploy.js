const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  console.log("SupplyChain deployed to:", supplyChain.target);

  const data = {
    address: supplyChain.target,
    abi: SupplyChain.interface.format('json')
  };
  fs.writeFileSync("contract-address.json", JSON.stringify(data));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});