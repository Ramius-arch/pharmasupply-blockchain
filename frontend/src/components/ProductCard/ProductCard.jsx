import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css'; // Import component-specific CSS

const ProductCard = ({ product }) => {
  // Check if product has image, use placeholder if not
  const imgUrl = product.image || '../../assets/placeholder.png';

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* Product Image */}
      <img src={imgUrl} alt={product.name} className="product-image" />

      {/* Product Details Overlay */}
      <div className="product-details">
        <h3>{product.name}</h3>
        <p>${(product.price / 100).toFixed(2)}</p>
        {/* Add to Cart button or other actions */}
        <button className="add-to-cart">Add to Cart</button>
      </div>
    </Link>
  );
};

export default ProductCard;
