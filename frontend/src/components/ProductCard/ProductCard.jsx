import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPills } from '@fortawesome/free-solid-svg-icons';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const imgUrl = product.image || `https://picsum.photos/seed/${product.id}/400/300?grayscale`;

  return (
    <article className="product-card animate-fade-in">
      <Link to={`/products/${product.id}`} className="product-image-link" aria-label={`View ${product.name}`}>
        <img src={imgUrl} alt={product.name} className="product-image" loading="lazy" />
      </Link>
      <div className="product-info">
        <div className="product-meta">
          {product.category && <span className="product-category">{product.category}</span>}
          {product.manufacturer && <span className="product-manufacturer">{product.manufacturer}</span>}
        </div>
        <h3 className="product-name">
          <FontAwesomeIcon icon={faPills} className="product-icon" />
          {product.name}
        </h3>
        <div className="product-price">${(product.price / 100).toFixed(2)}</div>
        <Link to={`/products/${product.id}`} className="btn btn-outline product-btn">
          View Details <FontAwesomeIcon icon={faArrowRight} />
        </Link>
      </div>
    </article>
  );
};

export default ProductCard;
