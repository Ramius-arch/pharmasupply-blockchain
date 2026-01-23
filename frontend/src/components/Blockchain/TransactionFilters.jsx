import React from 'react';
import './TransactionFilters.css';

const TransactionFilters = ({ onFilterChange, onSortChange, onSearchChange }) => {
  return (
    <div className="filters-container">
      <div className="filter-group">
        <input
          type="text"
          placeholder="Search by hash, block, or address..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="filter-group">
        <label htmlFor="type-filter">Filter by Type:</label>
        <select id="type-filter" onChange={(e) => onFilterChange('type', e.target.value)}>
          <option value="">All</option>
          <option value="ItemCreated">Item Created</option>
          <option value="ItemStatusUpdated">Status Updated</option>
        </select>
      </div>
      <div className="filter-group">
        <label htmlFor="sort-by">Sort by:</label>
        <select id="sort-by" onChange={(e) => onSortChange(e.target.value)}>
          <option value="timestamp_desc">Date (Newest First)</option>
          <option value="timestamp_asc">Date (Oldest First)</option>
          <option value="blockNumber_desc">Block Number (Highest First)</option>
          <option value="blockNumber_asc">Block Number (Lowest First)</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionFilters;

