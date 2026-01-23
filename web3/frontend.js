const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractABI = ["event ItemCreated(uint256 indexed,string,address)","event ItemStatusUpdated(uint256 indexed,uint8,address)","function createItem(string) returns (uint256)","function getItem(uint256) view returns (uint256,string,uint8,uint256)","function getItemHistory(uint256) view returns ((uint8,uint256,address)[])","function itemHistory(uint256,uint256) view returns (uint8,uint256,address)","function items(uint256) view returns (uint256,string,uint8,uint256)","function updateItemStatus(uint256,uint8)"];

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, contractABI, signer);

const statusEnum = ["Created", "InTransit", "Delivered", "Canceled"];

document.getElementById("createItemBtn").addEventListener("click", async () => {
    const description = document.getElementById("itemDescription").value;
    try {
        const tx = await contract.createItem(description);
        await tx.wait();
        alert("Item created successfully!");
    } catch (error) {
        console.error(error);
        alert("Error creating item.");
    }
});

document.getElementById("getItemBtn").addEventListener("click", async () => {
    const itemId = document.getElementById("itemId").value;
    try {
        const item = await contract.getItem(itemId);
        const status = statusEnum[item[2]];
        document.getElementById("itemStatus").innerText = `
            ID: ${item[0]}
            Description: ${item[1]}
            Status: ${status}
            Last Updated: ${new Date(item[3] * 1000).toLocaleString()}
        `;
    } catch (error) {
        console.error(error);
        alert("Error getting item.");
    }
});

document.getElementById("updateItemStatusBtn").addEventListener("click", async () => {
    const itemId = document.getElementById("updateItemId").value;
    const newStatus = document.getElementById("newStatus").value;
    try {
        const tx = await contract.updateItemStatus(itemId, newStatus);
        await tx.wait();
        alert("Item status updated successfully!");
    } catch (error) {
        console.error(error);
        alert("Error updating item status.");
    }
});
