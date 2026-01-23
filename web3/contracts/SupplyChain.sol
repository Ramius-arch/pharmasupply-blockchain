// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract SupplyChain {
    enum Status { Created, InTransit, Delivered, Canceled }

    struct Item {
        uint256 id;
        string description;
        Status status;
        uint256 lastUpdated;
    }

    struct StatusUpdate {
        Status status;
        uint256 timestamp;
        address updater;
    }

    uint256 private _itemCounter;
    mapping(uint256 => Item) public items;
    mapping(uint256 => StatusUpdate[]) public itemHistory;

    event ItemCreated(uint256 indexed itemId, string description, address creator);
    event ItemStatusUpdated(uint256 indexed itemId, Status newStatus, address updater);

    modifier onlyValidStatus(Status _status) {
        require(uint8(_status) <= uint8(Status.Canceled), "Invalid status");
        _;
    }

    modifier itemExists(uint256 _itemId) {
        require(_itemId > 0 && _itemId <= _itemCounter, "Item does not exist");
        _;
    }

    function createItem(string memory _description) public returns (uint256) {
        _itemCounter++;
        uint256 newItemId = _itemCounter;

        items[newItemId] = Item({
            id: newItemId,
            description: _description,
            status: Status.Created,
            lastUpdated: block.timestamp
        });

        _addStatusHistory(newItemId, Status.Created);

        emit ItemCreated(newItemId, _description, msg.sender);
        return newItemId;
    }

    function updateItemStatus(uint256 _itemId, Status _newStatus)
        public
        itemExists(_itemId)
        onlyValidStatus(_newStatus)
    {
        require(items[_itemId].status != _newStatus, "Item is already in this status");
        require(items[_itemId].status != Status.Delivered, "Cannot update status of a delivered item");
        
        items[_itemId].status = _newStatus;
        items[_itemId].lastUpdated = block.timestamp;
        
        _addStatusHistory(_itemId, _newStatus);

        emit ItemStatusUpdated(_itemId, _newStatus, msg.sender);
    }

    function getItem(uint256 _itemId)
        public
        view
        itemExists(_itemId)
        returns (uint256, string memory, Status, uint256)
    {
        Item memory item = items[_itemId];
        return (item.id, item.description, item.status, item.lastUpdated);
    }

    function getItemHistory(uint256 _itemId)
        public
        view
        itemExists(_itemId)
        returns (StatusUpdate[] memory)
    {
        return itemHistory[_itemId];
    }

    function _addStatusHistory(uint256 _itemId, Status _status) private {
        itemHistory[_itemId].push(StatusUpdate({
            status: _status,
            timestamp: block.timestamp,
            updater: msg.sender
        }));
    }
}
