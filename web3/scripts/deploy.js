const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer, supplier, courier] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  // The deployer becomes the default admin who can grant/revoke roles.
  const supplyChain = await SupplyChain.deploy(deployer.address);

  console.log("SupplyChain deployed to:", supplyChain.target);

  // For local development, auto-grant supplier and courier roles to the first test accounts.
  // In production these should be granted explicitly via an admin transaction.
  if (supplier && courier) {
    await (await supplyChain.grantRole(await supplyChain.SUPPLIER_ROLE(), supplier.address)).wait();
    await (await supplyChain.grantRole(await supplyChain.COURIER_ROLE(), courier.address)).wait();
    console.log("Granted SUPPLIER_ROLE to:", supplier.address);
    console.log("Granted COURIER_ROLE to:", courier.address);
  }

  const data = {
    address: supplyChain.target,
    abi: SupplyChain.interface.format('json')
  };
  fs.writeFileSync("contract-address.json", JSON.stringify(data, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
