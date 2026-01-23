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
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Shop the latest trends and get amazing deals!</p>
          <Link to="/products" className="button">Explore Now</Link>
        </div>
        {/* Add a background image or video here */}
      </section>

      {/* Categories Section */}
      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="category-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-card">
              <img src={'../../assets/placeholder.png'} alt={category.name} /> {/* Use theme placeholder */}
              <h3>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="product-grid">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="product-card"> {/* Changed from Link to div */}
              <img src={'../../assets/placeholder.png'} alt={product.name} /> {/* Use theme placeholder */}
              <h3>{product.name}</h3>
              <p>${(product.price / 100).toFixed(2)}</p>
            </div>
          ))}
          {/* Add "View All" button here */}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-content">
          {/* Navigation links, social media icons, copyright info */}
        </div>
      </footer>
    </div>
  );
};

export default Home;
