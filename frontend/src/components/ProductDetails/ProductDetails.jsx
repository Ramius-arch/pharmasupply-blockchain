import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductDetails.css'; // Import component-specific CSS
import placeholderImg from '../../assets/placeholder.png'; // Placeholder image
import productService from '../../api/productService'; // Import the new product service
import blockchainService from '../../api/blockchainService'; // Import the blockchain service
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const ProductDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockchainItem, setBlockchainItem] = useState(null);
  const [blockchainHistory, setBlockchainHistory] = useState(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const productData = await productService.getProductById(id);
        setProduct(productData.data);

        if (productData.data.blockchainItemId && token) {
          const blockchainDetails = await blockchainService.getBlockchainItemDetails(productData.data.blockchainItemId, token);
          setBlockchainItem(blockchainDetails.data);

          const blockchainHist = await blockchainService.getBlockchainItemHistory(productData.data.blockchainItemId, token);
          setBlockchainHistory(blockchainHist.data);
        }
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, token]);

  if (loading) return <div className="container" style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;
  if (error || !product) return <div className="container" style={{ padding: '80px', textAlign: 'center', color: 'var(--danger)' }}>{error || 'Product not found'}</div>;

  return (
    <div className="product-details-container container animate-fade-in">
      <div className="product-layout">
        {/* Left: Product Image */}
        <div className="product-media">
          <img src={product.image || 'https://picsum.photos/seed/' + id + '/800/600?grayscale'} alt={product.name} className="main-image" />
          {blockchainItem && (
            <div className="blockchain-badge">
              <span className="pulse"></span>
              Blockchain Verified: {blockchainItem.id}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="product-core-info">
          <div className="product-header">
            <span className="category-tag">{product.category}</span>
            <h1>{product.name}</h1>
            <p className="price-tag">${product.unitPrice?.toFixed(2)}</p>
          </div>

          <div className="product-specs card">
            <div className="spec-item"><span>Manufacturer</span> <strong>{product.manufacturer}</strong></div>
            <div className="spec-item"><span>Dosage Form</span> <strong>{product.dosageForm}</strong></div>
            <div className="spec-item"><span>Strength</span> <strong>{product.strength}</strong></div>
            <div className="spec-item"><span>In Stock</span> <strong>{product.quantityInStock} units</strong></div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', height: '56px', fontSize: '1.1rem' }}>
            Add to Shipment Cart
          </button>
        </div>
      </div>

      <div className="details-grid">
        {/* Blockchain Traceability */}
        {blockchainItem && (
          <div className="blockchain-traceability card">
            <h2>Blockchain Traceability</h2>
            <div className="status-banner">
              <div className="status-label">Current Node Status</div>
              <div className="status-value">{blockchainItem.status}</div>
            </div>

            {blockchainHistory && (
              <div className="timeline">
                <h3>Transaction History</h3>
                {blockchainHistory.map((entry, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <div className="timeline-status">{entry.status}</div>
                      <div className="timeline-meta">
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                        <span className="address">By: {entry.updater.slice(0, 6)}...{entry.updater.slice(-4)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews */}
        <div className="product-reviews card">
          <h2>Verified Reviews</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>No reviews yet for this batch.</p>

          <form className="review-form">
            <h3>Share Feedback</h3>
            <div className="input-row">
              <label>Rating</label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value="0">Select Rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Good</option>
                <option value="3">3 - Average</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            </div>
            <div className="input-row">
              <label>Comment</label>
              <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Batch feedback..."></textarea>
            </div>
            <button className="btn btn-outline" style={{ width: '100%' }}>Submit Feedback</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;