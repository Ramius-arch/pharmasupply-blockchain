const { ethers } = require("hardhat");
const contractAddress = require("../contract-address.json"); // Assuming this file exists after deployment

async function main() {
  console.log("Generating 300 demo blockchain transactions...");

  const [deployer, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners(); // Get more signers for diverse transactions
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.attach(contractAddress.address);

  const productBaseNames = [
    "Paracetamol", "Amoxicillin", "Ibuprofen", "Cetirizine",
    "Omeprazole", "Metformin", "Aspirin", "Atorvastatin",
    "Lisinopril", "Levothyroxine", "Simvastatin", "Amlodipine",
    "Gabapentin", "Hydrochlorothiazide", "Sertraline", "Ranitidine"
  ];

  const dosageForms = ["Tablet", "Capsule", "Syrup", "Injection", "Cream"];
  const strengths = ["10mg", "25mg", "50mg", "100mg", "250mg", "500mg"];

  const generateProductName = (index) => {
    const base = productBaseNames[index % productBaseNames.length];
    const strength = strengths[Math.floor(Math.random() * strengths.length)];
    const dosage = dosageForms[Math.floor(Math.random() * dosageForms.length)];
    return `${base} ${strength} ${dosage} (Batch ${index + 1})`;
  };

  const createdItemIds = [];
  const NUM_PRODUCTS_TO_CREATE = 150;
  const NUM_STATUS_UPDATES_PER_PRODUCT = 1; // 1 status update per product, leading to 150 updates
  const TOTAL_TRANSACTIONS = NUM_PRODUCTS_TO_CREATE + (NUM_PRODUCTS_TO_CREATE * NUM_STATUS_UPDATES_PER_PRODUCT);


  // Transaction 1-150: Create 150 new products on the blockchain
  console.log(`\n--- Creating ${NUM_PRODUCTS_TO_CREATE} Products on Blockchain ---`);
  for (let i = 0; i < NUM_PRODUCTS_TO_CREATE; i++) {
    const itemName = generateProductName(i);
    const creatorAddress = [deployer, addr1, addr2][i % 3].address; // Rotate creators
    const tx = await supplyChain.createItem(itemName);
    const receipt = await tx.wait();
    
    // In Ethers v6, events are accessed via receipt.logs and parsed
    const itemCreatedEvent = receipt.logs.find(log => supplyChain.interface.parseLog(log)?.name === "ItemCreated");
    if (!itemCreatedEvent) {
      throw new Error("ItemCreated event not found in receipt");
    }
    const parsedCreatedEvent = supplyChain.interface.parseLog(itemCreatedEvent);
    const itemId = parsedCreatedEvent.args.itemId;
    createdItemIds.push(itemId);
    console.log(`[TX HASH: ${tx.hash}] Created Item "${itemName}" (ID: ${itemId}) by ${deployer.address}`);
  }

  // Transaction 151-300: Update status for the created products
  console.log(`\n--- Updating Status for ${NUM_PRODUCTS_TO_CREATE} Products ---`);
  const statuses = ["InTransit", "Delivered", "Canceled"]; // Align with ContractStatus enum keys
  for (let i = 0; i < NUM_PRODUCTS_TO_CREATE; i++) {
    const itemIdToUpdate = createdItemIds[i];
    // Map numerical status from ContractStatus enum
    const newStatusKey = statuses[i % statuses.length]; // "InTransit", "Delivered", etc.
    const newStatusValue = { "Created": 0, "InTransit": 1, "Delivered": 2, "Canceled": 3 }[newStatusKey];
    if (newStatusValue === undefined) {
      throw new Error(`Invalid status key: ${newStatusKey}`);
    }

    const updaterAddress = [addr1, addr2, addr3, addr4, addr5][i % 5].address; // Rotate updaters
    
    const tx = await supplyChain.updateItemStatus(itemIdToUpdate, newStatusValue); // Pass enum value
    const receipt = await tx.wait();
    
    const itemStatusUpdatedEvent = receipt.logs.find(log => supplyChain.interface.parseLog(log)?.name === "ItemStatusUpdated");
    if (!itemStatusUpdatedEvent) {
      throw new Error("ItemStatusUpdated event not found in receipt");
    }
    const parsedUpdatedEvent = supplyChain.interface.parseLog(itemStatusUpdatedEvent);
    console.log(`[TX HASH: ${tx.hash}] Item ID ${itemIdToUpdate} updated to "${newStatusKey}" by ${updaterAddress}`);
  }

  console.log(`\n${TOTAL_TRANSACTIONS} demo transactions generated successfully!`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
