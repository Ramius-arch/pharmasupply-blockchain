import React, { useState, useEffect } from 'react';
import productService from '../api/productService'; // Assuming you have a productService
import ProductCard from '../components/ProductCard/ProductCard'; // Import ProductCard
import './Product.css'; // Import page-specific CSS

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        // Assuming response.data contains an array of products
        setProducts(response.data); // Adjust based on your API response structure
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="products-page container animate-fade-in">
      <div style={{ marginBottom: '48px', textAlign: 'center' }}>
        <h1 className="logo" style={{ fontSize: '3rem', marginBottom: '16px' }}>Pharmacy Catalog</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Verified and tracked pharmaceutical products on the blockchain.</p>
      </div>

      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>No products found in the catalog.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                price: product.unitPrice,
                image: product.image,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;