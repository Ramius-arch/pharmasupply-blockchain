import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

// Placeholder data for demonstration purposes
const products = [
  { id: 1, name: 'Product 1', price: 99.99, image: '/images/product1.jpg' },
  { id: 2, name: 'Product 2', price: 49.99, image: '/images/product2.jpg' },
  // ... more products
];

const categories = [
  { id: 1, name: 'Electronics', image: '/images/electronics.jpg' },
  { id: 2, name: 'Clothing', image: '/images/clothing.jpg' },
  // ... more categories
];

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero animate-fade-in">
        <div className="container">
          <div className="hero-content">
            <h1>The Future of Pharma Traceability</h1>
            <p>Secure, transparent, and decentralized supply chain management for the modern pharmaceutical industry.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/products" className="btn btn-primary">Browse Catalog</Link>
              <Link to="/admin" className="btn btn-outline">Admin Portal</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Trust through Transparency</h2>
          <div className="category-grid">
            <div className="category-card">
              <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>🛡️</div>
              <h3>Immutable Records</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Every movement is logged on the blockchain, ensuring data integrity and authenticity.</p>
            </div>
            <div className="category-card">
              <div style={{ fontSize: '2rem', color: 'var(--secondary)' }}>📦</div>
              <h3>Real-time Tracking</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Monitor shipment status from manufacturing to final delivery with instant updates.</p>
            </div>
            <div className="category-card">
              <div style={{ fontSize: '2rem', color: 'var(--warning)' }}>⚡</div>
              <h3>Smart Logistics</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Automated status transitions and smart contract execution for efficient operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Verified Pharmaceuticals</h2>
          <div className="product-grid">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="product-card">
                <img src={'https://picsum.photos/seed/' + product.id + '/400/300?grayscale'} alt={product.name} />
                <h3>{product.name}</h3>
                <div className="price">${(product.price / 100).toFixed(2)}</div>
                <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ marginTop: '16px', width: '100%' }}>View Details</Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
