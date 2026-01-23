import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Analytics from './Analytics'; // Import the Analytics component
import TransactionFilters from './TransactionFilters'; // Import the TransactionFilters component
import './TransactionHistory.css'; // Import component-specific CSS

const TransactionHistory = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext); // Destructure authLoading
  const token = user?.token;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); // Component's own loading state
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ type: '' });
  const [sort, setSort] = useState('timestamp_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const handleSortChange = (value) => {
    setSort(value);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const filteredAndSortedTransactions = transactions
    .filter(tx => {
      if (filters.type && tx.type !== filters.type) {
        return false;
      }
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          tx.transactionHash.toLowerCase().includes(lowerCaseQuery) ||
          tx.blockNumber.toString().includes(lowerCaseQuery) ||
          tx.itemId.toString().includes(lowerCaseQuery)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const [key, order] = sort.split('_');
      if (order === 'asc') {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });

  const paginatedTransactions = filteredAndSortedTransactions.slice(0, currentPage * itemsPerPage);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      // Only proceed if AuthContext has finished loading
      if (authLoading) {
        return;
      }

      if (!isAuthenticated || !token) {
        setError('You must be logged in to view blockchain transactions.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // Set component's loading state
        const response = await axios.get('/api/blockchain/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTransactions(response.data.data);
      } catch (err) {
        setError('Failed to fetch blockchain transactions. Ensure backend and blockchain are running.');
        console.error('Error fetching blockchain transactions:', err);
        toast.error('Failed to fetch blockchain transactions.');
      } finally {
        setLoading(false); // Clear component's loading state
      }
    };

    fetchTransactions();
  }, [isAuthenticated, token, authLoading]); // Add authLoading to dependency array

  if (authLoading) {
    return <div className="loading">Loading authentication status...</div>;
  }


  if (loading) {
    return <div className="loading">Loading blockchain transactions...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="transaction-history-container">
      <h1>Blockchain Transaction History</h1>
      <Analytics transactions={transactions} />
      <TransactionFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onSearchChange={handleSearchChange}
      />
      {paginatedTransactions.length === 0 ? (
        <p className="no-data">No blockchain transactions found that match the current filters.</p>
      ) : (
        <>
          <div className="transaction-list">
            {paginatedTransactions.map((tx, index) => (
              <div key={tx.transactionHash + index} className="transaction-card">
                <h3>Type: {tx.type}</h3>
                <p><strong>Tx Hash:</strong> <a href={`https://etherscan.io/tx/${tx.transactionHash}`} target="_blank" rel="noopener noreferrer" className="tx-hash-link">{tx.transactionHash.substring(0, 10)}...{tx.transactionHash.substring(tx.transactionHash.length - 8)}</a></p>
                <p><strong>Block:</strong> {tx.blockNumber}</p>
                <p><strong>Timestamp:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
                <p><strong>Item ID:</strong> {tx.itemId}</p>
                {tx.type === 'ItemCreated' && (
                  <>
                    <p><strong>Item Name:</strong> {tx.itemName}</p>
                    <p><strong>Creator:</strong> {tx.creator}</p>
                  </>
                )}
                {tx.type === 'ItemStatusUpdated' && (
                  <>
                    <p><strong>Old Status:</strong> {tx.oldStatus}</p>
                    <p><strong>New Status:</strong> {tx.newStatus}</p>
                    <p><strong>Updater:</strong> {tx.updater}</p>
                  </>
                )}
              </div>
            ))}
          </div>
          {filteredAndSortedTransactions.length > paginatedTransactions.length && (
            <div className="load-more-container">
              <button onClick={handleLoadMore} className="load-more-btn">Load More</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
