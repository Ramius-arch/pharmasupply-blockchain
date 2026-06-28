import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldAlt,
  faTruckFast,
  faMicrochip,
  faArrowRight,
  faCube,
} from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from '../../context/AuthContext';
import productService from '../../api/productService';
import LoadingSpinner from '../UI/LoadingSpinner';
import EmptyState from '../UI/EmptyState';
import ProductCard from '../ProductCard/ProductCard';
import './Home.css';

const trustCards = [
  {
    icon: faShieldAlt,
    title: 'Immutable Records',
    description: 'Every movement is logged on the blockchain, ensuring data integrity and authenticity.',
    color: 'var(--primary)',
  },
  {
    icon: faTruckFast,
    title: 'Real-time Tracking',
    description: 'Monitor shipment status from manufacturing to final delivery with instant updates.',
    color: 'var(--secondary)',
  },
  {
    icon: faMicrochip,
    title: 'Smart Logistics',
    description: 'Automated status transitions and smart contract execution for efficient operations.',
    color: 'var(--warning)',
  },
];

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        setError('Unable to load featured products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const canAccessAdmin = user?.role === 'admin' || user?.role === 'supplier';

  return (
    <div className="home-container">
      <section className="hero animate-fade-in">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <FontAwesomeIcon icon={faCube} />
              <span>Blockchain-Powered Supply Chain</span>
            </div>
            <h1>The Future of Pharma Traceability</h1>
            <p>
              Secure, transparent, and decentralized supply chain management for the modern pharmaceutical industry.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary">
                Browse Catalog <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              {isAuthenticated && canAccessAdmin && (
                <Link to="/admin" className="btn btn-outline">
                  Control Center
                </Link>
              )}
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline">
                  Join Network
                </Link>
              )}
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-value">100%</div>
                <div className="hero-stat-label">Ledger Verified</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">24/7</div>
                <div className="hero-stat-label">Real-time Tracking</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-value">0</div>
                <div className="hero-stat-label">Data Tampering</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container">
          <h2 className="section-title">Trust through Transparency</h2>
          <div className="category-grid stagger-children">
            {trustCards.map((card) => (
              <div key={card.title} className="category-card">
                <div className="category-icon" style={{ color: card.color }}>
                  <FontAwesomeIcon icon={card.icon} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <div className="featured-header">
            <div>
              <h2 className="section-title" style={{ marginBottom: '8px', textAlign: 'left' }}>
                Verified Pharmaceuticals
              </h2>
              <p className="featured-subtitle">
                Featured products from the blockchain-verified catalog.
              </p>
            </div>
            <Link to="/products" className="btn btn-outline hidden-mobile">
              View All <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading featured products..." />
          ) : error ? (
            <EmptyState
              icon={faCube}
              title="Catalog unavailable"
              description={error}
              action={<Link to="/products" className="btn btn-outline">Browse products</Link>}
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={faCube}
              title="No products yet"
              description="The pharmaceutical catalog is currently empty."
              action={<Link to="/products" className="btn btn-outline">Browse products</Link>}
            />
          ) : (
            <div className="product-grid stagger-children">
              {products.slice(0, 3).map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={{
                    id: product._id || product.id,
                    name: product.name,
                    price: product.unitPrice ?? product.price ?? 0,
                    image: product.image,
                    category: product.category,
                    manufacturer: product.manufacturer,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
