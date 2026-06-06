import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Import component-specific CSS

const ProductCard = ({ product }) => {
  const imgUrl = product.image || 'https://picsum.photos/seed/' + product.id + '/400/300?grayscale';

  return (
    <div className="product-card animate-fade-in">
      <Link to={`/products/${product.id}`} className="product-image-link">
        <img src={imgUrl} alt={product.name} className="product-image" />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">${(product.price / 100).toFixed(2)}</div>
        <Link to={`/products/${product.id}`} className="btn btn-outline" style={{ width: '100%' }}>View Details</Link>
      </div>
    </div>
  );
};

export default ProductCard;
