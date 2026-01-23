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
    <div className="products-page">
      <h1 className="page-title">Available Products</h1>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                price: product.unitPrice, // Map unitPrice to price for ProductCard
                image: product.image, // ProductCard expects 'image'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;