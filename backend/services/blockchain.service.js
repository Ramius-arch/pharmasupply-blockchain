const { ethers } = require("ethers");
const env = require('../config/env');
const { SUPPLY_CHAIN_CONTRACT_ADDRESS, SUPPLY_CHAIN_CONTRACT_ABI } = require('../config/blockchain');

/**
 * Helper function to recursively convert BigInts to strings in an object.
 * This is necessary because JSON.stringify cannot serialize BigInts.
 * @param {object} obj - The object to convert BigInts in.
 * @returns {object} The object with BigInts converted to strings.
 */
function convertBigIntsToStrings(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Add this check for Date objects
  if (obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertBigIntsToStrings(item));
  }

  const newObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'bigint') {
        newObj[key] = value.toString();
      } else if (typeof value === 'object' && value !== null) {
        newObj[key] = convertBigIntsToStrings(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj;
}

/**
 * @dev Maps string representation of item status to their corresponding enum values
 *      as defined in the SupplyChain smart contract.
 */
const ContractStatus = {
  Created: 0,
  InTransit: 1,
  Delivered: 2,
  Canceled: 3,
};

if (!SUPPLY_CHAIN_CONTRACT_ADDRESS || !SUPPLY_CHAIN_CONTRACT_ABI) {
  console.warn('Blockchain contract address or ABI is missing. Blockchain features will be unavailable.');
}

if (!env.DEV_PRIVATE_KEY) {
  console.warn('DEV_PRIVATE_KEY is not set. Blockchain write operations will be unavailable.');
}

/**
 * @dev Initializes an Ethers.js provider from the configured RPC URL.
 */
const provider = new ethers.JsonRpcProvider(env.HARDHAT_RPC_URL);

/**
 * @dev Initializes an Ethers.js Wallet instance to sign transactions.
 *      For development, the private key from environment variables is used.
 *      In production, this should be replaced with a KMS/HSM signer.
 */
const signer = env.DEV_PRIVATE_KEY
  ? new ethers.Wallet(env.DEV_PRIVATE_KEY, provider)
  : null;

/**
 * @dev Creates an Ethers.js Contract instance for the SupplyChain smart contract.
 *      This instance is used to interact with the deployed contract on the blockchain.
 */
const supplyChainContract = SUPPLY_CHAIN_CONTRACT_ADDRESS && SUPPLY_CHAIN_CONTRACT_ABI && signer
  ? new ethers.Contract(SUPPLY_CHAIN_CONTRACT_ADDRESS, SUPPLY_CHAIN_CONTRACT_ABI, signer)
  : null;

/**
 * @dev Service function to create a new item on the blockchain.
 *      It interacts with the `createItem` function of the deployed SupplyChain contract.
 * @param {string} description - The description of the item to be created.
 * @returns {Promise<string>} The unique ID of the newly created item on the blockchain.
 * @throws {Error} If the transaction fails or the item ID cannot be retrieved.
 */
exports.createItemOnBlockchain = async (description) => {
  if (!supplyChainContract) {
    throw new Error('Blockchain contract is not configured');
  }
  try {
    const tx = await supplyChainContract.createItem(description);
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    let newItemId;
    if (receipt.logs) {
      // Find the ItemCreated event in the transaction receipt logs to get the new item's ID.
      for (const log of receipt.logs) {
        try {
          const parsedLog = supplyChainContract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === "ItemCreated") {
            // In Ethers v6, args can be accessed by name or index
            newItemId = parsedLog.args.itemId ? parsedLog.args.itemId.toString() : parsedLog.args[0].toString();
            break;
          }
        } catch (e) {
          // Log might not be from this contract, skip it
          continue;
        }
      }
    }
    
    if (!newItemId) {
      // This case should ideally not happen if the contract emits the event correctly.
      console.warn("Could not parse newItemId from event. Falling back to direct call result if available.");
      throw new Error("Failed to retrieve new item ID from blockchain event.");
    }
    return newItemId;
  } catch (error) {
    console.error("Error creating item on blockchain:", error);
    throw new Error("Failed to create item on blockchain.");
  }
};

/**
 * @dev Service function to update the status of an existing item on the blockchain.
 *      It interacts with the `updateItemStatus` function of the deployed SupplyChain contract.
 * @param {string} itemId - The unique ID of the item on the blockchain.
 * @param {string} newStatus - The new status string (e.g., "InTransit", "Delivered").
 * @returns {Promise<boolean>} True if the status update transaction is successful.
 * @throws {Error} If the newStatus is invalid or the transaction fails.
 */
exports.updateItemStatusOnBlockchain = async (itemId, newStatus) => {
  if (!supplyChainContract) {
    throw new Error('Blockchain contract is not configured');
  }
  try {
    // Convert string status to its corresponding blockchain enum value.
    const statusValue = ContractStatus[newStatus]; 
    if (statusValue === undefined) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    const tx = await supplyChainContract.updateItemStatus(itemId, statusValue);
    await tx.wait(); // Wait for the transaction to be mined
    return true;
  } catch (error) {
    console.error(`Error updating status for item ${itemId} on blockchain:`, error);
    throw new Error("Failed to update item status on blockchain.");
  }
};

/**
 * @dev Service function to retrieve details of a specific item from the blockchain.
 *      It interacts with the `getItem` view function of the deployed SupplyChain contract.
 * @param {string} itemId - The unique ID of the item on the blockchain.
 * @returns {Promise<object>} An object containing the item's ID, description, status, and last updated timestamp.
 * @throws {Error} If the item cannot be retrieved from the blockchain.
 */
exports.getItemFromBlockchain = async (itemId) => {
  if (!supplyChainContract) {
    throw new Error('Blockchain contract is not configured');
  }
  try {
    const item = await supplyChainContract.getItem(itemId);
    // Convert BigInts from Solidity to JavaScript numbers/strings and enum value to string.
    return {
      id: item[0].toString(),
      description: item[1],
      status: Object.keys(ContractStatus)[item[2]], // Map enum index back to string name
      lastUpdated: new Date(Number(item[3]) * 1000), // Convert Unix timestamp to Date object
    };
  } catch (error) {
    console.error(`Error getting item ${itemId} from blockchain:`, error);
    throw new Error("Failed to retrieve item from blockchain.");
  }
};

/**
 * @dev Service function to retrieve the status history of a specific item from the blockchain.
 *      It interacts with the `getItemHistory` view function of the deployed SupplyChain contract.
 * @param {string} itemId - The unique ID of the item on the blockchain.
 * @returns {Promise<Array<object>>} An array of objects, each representing a status update with status, timestamp, and updater.
 * @throws {Error} If the item history cannot be retrieved from the blockchain.
 */
exports.getItemHistoryFromBlockchain = async (itemId) => {
  if (!supplyChainContract) {
    throw new Error('Blockchain contract is not configured');
  }
  try {
    const history = await supplyChainContract.getItemHistory(itemId);
    // Map raw history data to a more readable format.
    return history.map(entry => ({
      status: Object.keys(ContractStatus)[entry[0]], // Map enum index back to string name
      timestamp: new Date(Number(entry[1]) * 1000), // Convert Unix timestamp to Date object
      updater: entry[2], // Address of the account that updated the status
    }));
  } catch (error) {
    console.error(`Error getting item history for ${itemId} from blockchain:`, error);
    throw new Error("Failed to retrieve item history from blockchain.");
  }
};

/**
 * @dev Service function to retrieve all ItemCreated and ItemStatusUpdated events from the blockchain.
 * @returns {Promise<Array<object>>} An array of event objects, each representing a transaction.
 * @throws {Error} If events cannot be retrieved from the blockchain.
 */
exports.getBlockchainTransactions = async () => {
  if (!supplyChainContract) {
    throw new Error('Blockchain contract is not configured');
  }
  try {
    // Define filters for the events we are interested in
    const itemCreatedFilter = supplyChainContract.filters.ItemCreated();
    const itemStatusUpdatedFilter = supplyChainContract.filters.ItemStatusUpdated();

    // Query events from block 0 to 'latest'
    const createdEvents = await supplyChainContract.queryFilter(itemCreatedFilter, 0, 'latest');
    const updatedEvents = await supplyChainContract.queryFilter(itemStatusUpdatedFilter, 0, 'latest');

    let transactions = [];

    // Process ItemCreated events
    for (const event of createdEvents) {
      const parsedEvent = supplyChainContract.interface.parseLog(event);
      if (!parsedEvent || !parsedEvent.args) {
        console.error('Error: Failed to parse ItemCreated event or event.args is undefined:', event);
        continue;
      }
      const block = await provider.getBlock(event.blockNumber);
      transactions.push(convertBigIntsToStrings({
        type: 'ItemCreated',
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber.toString(),
        timestamp: new Date(Number(block.timestamp) * 1000), // Ensure block.timestamp is Number before * 1000
        itemId: parsedEvent.args[0].toString(), // Access by index
        itemName: parsedEvent.args[1],     // Access by index
        creator: parsedEvent.args[2],      // Access by index
      }));
    }

    // Process ItemStatusUpdated events
    for (const event of updatedEvents) {
      const parsedEvent = supplyChainContract.interface.parseLog(event);
      if (!parsedEvent) { // Check if parsing was successful
        console.error('Error: Failed to parse ItemStatusUpdated event:', event);
        continue;
      }

      // Access itemId from event.topics (indexed parameter)
      const itemIdFromTopic = ethers.toBigInt(event.topics[1]).toString();

      // Access other arguments from parsedEvent.args (non-indexed)
      const newStatusValue = parsedEvent.args[0]; // Access by index
      const updater = parsedEvent.args[1];      // Access by index

      if (itemIdFromTopic === undefined || newStatusValue === undefined || updater === undefined) {
        console.error('Error: ItemStatusUpdated event missing expected arguments (itemId, newStatus, updater):', parsedEvent.args);
        continue;
      }

      const block = await provider.getBlock(event.blockNumber);
      transactions.push(convertBigIntsToStrings({
        type: 'ItemStatusUpdated',
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber.toString(),
        timestamp: new Date(Number(block.timestamp) * 1000), // Ensure block.timestamp is Number before * 1000
        itemId: itemIdFromTopic,
        oldStatus: null,
        newStatus: Object.keys(ContractStatus)[Number(newStatusValue)], // Explicitly convert BigInt to Number for array indexing
        updater: updater,
      }));
    }

    // Sort transactions by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return transactions;
  } catch (error) {
    console.error("Error getting blockchain transactions:", error);
    throw new Error("Failed to retrieve blockchain transactions.");
  }
};
