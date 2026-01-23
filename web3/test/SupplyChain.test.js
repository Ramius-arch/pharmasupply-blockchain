const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain", function () {
  async function deploySupplyChainFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    const supplyChain = await SupplyChain.deploy();

    return { supplyChain, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy without errors", async function () {
      const { supplyChain } = await loadFixture(deploySupplyChainFixture);
      expect(supplyChain.target).to.not.be.null;
    });
  });

  describe("Items", function () {
    it("Should allow creating a new item", async function () {
      const { supplyChain } = await loadFixture(deploySupplyChainFixture);
      await expect(supplyChain.createItem("Test Item 1"))
        .to.emit(supplyChain, "ItemCreated")
        .withArgs(1, "Test Item 1", anyValue); // anyValue for the creator address
    });

    it("Should return the correct item details", async function () {
      const { supplyChain } = await loadFixture(deploySupplyChainFixture);
      await supplyChain.createItem("Test Item 2");
      const [id, description, status] = await supplyChain.getItem(1);
      expect(id).to.equal(1);
      expect(description).to.equal("Test Item 2");
      expect(status).to.equal(0); // Status.Created
    });

    it("Should allow updating an item's status", async function () {
        const { supplyChain } = await loadFixture(deploySupplyChainFixture);
        await supplyChain.createItem("Test Item 3");

        const newStatus = 1; // Status.InTransit
        await expect(supplyChain.updateItemStatus(1, newStatus))
            .to.emit(supplyChain, "ItemStatusUpdated")
            .withArgs(1, newStatus, anyValue); // anyValue for the updater address
        
        const [, , status] = await supplyChain.getItem(1);
        expect(status).to.equal(newStatus);
    });

    it("Should retrieve item history", async function () {
        const { supplyChain } = await loadFixture(deploySupplyChainFixture);
        await supplyChain.createItem("Test Item 4");
        await supplyChain.updateItemStatus(1, 1); // InTransit
        await supplyChain.updateItemStatus(1, 2); // Delivered

        const history = await supplyChain.getItemHistory(1);
        expect(history.length).to.equal(3);
        expect(history[0].status).to.equal(0); // Created
        expect(history[1].status).to.equal(1); // InTransit
        expect(history[2].status).to.equal(2); // Delivered
    });

        it("Should fail to update status for a non-existent item", async function () {

            const { supplyChain } = await loadFixture(deploySupplyChainFixture);

            await expect(supplyChain.updateItemStatus(99, 1)).to.be.revertedWith("Item does not exist");

        });

    

    it("Should fail to update status of a delivered item", async function () {
      const { supplyChain } = await loadFixture(deploySupplyChainFixture);
      await supplyChain.createItem("Test Item 6");
      await supplyChain.updateItemStatus(1, 2); // Delivered
      await expect(supplyChain.updateItemStatus(1, 1)).to.be.revertedWith("Cannot update status of a delivered item");
    });

    it("Should fail to update status with the same status", async function () {
      const { supplyChain } = await loadFixture(deploySupplyChainFixture);
      await supplyChain.createItem("Test Item 7");
      await expect(supplyChain.updateItemStatus(1, 0)).to.be.revertedWith("Item is already in this status");
    });
  });
});


    