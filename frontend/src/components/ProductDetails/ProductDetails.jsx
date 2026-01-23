import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductDetails.css'; // Import component-specific CSS
import placeholderImg from '../../assets/placeholder.png'; // Placeholder image
import productService from '../../api/productService'; // Import the new product service
import blockchainService from '../../api/blockchainService'; // Import the blockchain service
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const ProductDetails = () => {
  const { id } = useParams(); // Changed from productId to id
  const { user } = useContext(AuthContext); // Get user from AuthContext
  const token = user?.token;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockchainItem, setBlockchainItem] = useState(null);
  const [blockchainHistory, setBlockchainHistory] = useState(null);

  // State for review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData.data); // Assuming the API returns { data: product }

        // If product has a blockchainItemId, fetch blockchain data
        if (productData.data.blockchainItemId && token) {
          const blockchainDetails = await blockchainService.getBlockchainItemDetails(productData.data.blockchainItemId, token);
          setBlockchainItem(blockchainDetails.data);

          const blockchainHist = await blockchainService.getBlockchainItemHistory(productData.data.blockchainItemId, token);
          setBlockchainHistory(blockchainHist.data);
        }
      } catch (err) {
        setError('Failed to fetch product details or blockchain data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token]); // Re-fetch if ID or token changes

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="no-data">Product not found.</div>;
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!comment || rating === 0) {
        alert('Please provide a rating and a comment.');
        return;
    }
    // Process form submission and add review to product
    alert(`Review Submitted! Rating: ${rating}, Comment: ${comment}`);
    // Here you would typically send this data to your backend
    setRating(0);
    setComment('');
  };

  return (
    <div className="product-details-container">
      <div className="product-details">
        {/* Product Image */}
        <img src={product.image || placeholderImg} alt={product.name} className="detail-image" /> {/* Using placeholder for now */}

        {/* Product Information */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="price">Price: ${product.unitPrice ? product.unitPrice.toFixed(2) : 'N/A'}</p>
          <p>Category: {product.category}</p>
          <p>Manufacturer: {product.manufacturer}</p>
          <p>Quantity in Stock: {product.quantityInStock}</p>
          <p>Dosage Form: {product.dosageForm}</p>
          <p>Strength: {product.strength}</p>
          <p>Pharmaceutical Code: {product.pharmaceuticalCode}</p>

          {/* Product Description */}
          <div className="description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>
          
          {/* Blockchain Information */}
          {blockchainItem && (
            <div className="blockchain-info">
              <h2>Blockchain Tracking</h2>
              <p>Blockchain Item ID: {blockchainItem.id}</p>
              <p>Current Status: {blockchainItem.status}</p>
              <p>Last Updated (Blockchain): {blockchainItem.lastUpdated?.toLocaleString()}</p>

              {blockchainHistory && blockchainHistory.length > 0 && (
                <div className="blockchain-history">
                  <h3>Status History</h3>
                  <ul>
                    {blockchainHistory.map((entry, index) => (
                      <li key={index}>
                        {entry.status} at {entry.timestamp?.toLocaleString()} by {entry.updater}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reviews Section */}
          <div className="reviews-section">
            <h2>Customer Reviews</h2>
            {/* Display existing reviews here */}
            {/* For now, a simple message */}
            <p>No reviews yet. Be the first to review!</p> 

            <h3>Write a Review</h3>
            <form onSubmit={handleReviewSubmit}>
              <div className="review-input-group">
                <label htmlFor="rating">Rating:</label>
                <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                  <option value="0">Select a rating</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
              <div className="review-input-group">
                <label htmlFor="comment">Comment:</label>
                <textarea
                  id="comment"
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  required
                ></textarea>
              </div>
              <button type="submit">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;