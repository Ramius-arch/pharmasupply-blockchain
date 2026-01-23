import React, { useState, useEffect, useContext } from 'react';
import './AdminDashboard.css';
import productService from '../../api/productService';
import blockchainService from '../../api/blockchainService';
import { AuthContext } from '../../context/AuthContext';

const ProductManagement = () => {
  const { user } = useContext(AuthContext);
  const token = user?.token;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    unitPrice: '',
    category: '',
    manufacturer: '',
    quantityInStock: '',
    dosageForm: '',
    strength: '',
    pharmaceuticalCode: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAllProducts();
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // 1. Create blockchain item
      const blockchainResponse = await blockchainService.createBlockchainItem(newProduct.description, token);
      const blockchainItemId = blockchainResponse.data.itemId;

      // 2. Create product with blockchainItemId
      const productToCreate = { ...newProduct, blockchainItemId };
      const productResponse = await productService.createProduct(productToCreate, token);

      // 3. Update products list
      setProducts([...products, productResponse.data]);
      setNewProduct({
        name: '',
        description: '',
        unitPrice: '',
        category: '',
        manufacturer: '',
        quantityInStock: '',
        dosageForm: '',
        strength: '',
        pharmaceuticalCode: '',
      });
    } catch (err) {
      setError('Failed to create product.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Product Management</h3>
      
      <h4>Create New Product</h4>
      <form onSubmit={handleFormSubmit}>
        <input name="name" value={newProduct.name} onChange={handleInputChange} placeholder="Name" required />
        <textarea name="description" value={newProduct.description} onChange={handleInputChange} placeholder="Description" required />
        <input name="unitPrice" value={newProduct.unitPrice} onChange={handleInputChange} placeholder="Price" type="number" required />
        <input name="category" value={newProduct.category} onChange={handleInputChange} placeholder="Category" required />
        <input name="manufacturer" value={newProduct.manufacturer} onChange={handleInputChange} placeholder="Manufacturer" required />
        <input name="quantityInStock" value={newProduct.quantityInStock} onChange={handleInputChange} placeholder="Stock" type="number" required />
        <input name="dosageForm" value={newProduct.dosageForm} onChange={handleInputChange} placeholder="Dosage Form" />
        <input name="strength" value={newProduct.strength} onChange={handleInputChange} placeholder="Strength" />
        <input name="pharmaceuticalCode" value={newProduct.pharmaceuticalCode} onChange={handleInputChange} placeholder="Pharmaceutical Code" />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>

      <h4>Existing Products</h4>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product._id}</td>
              <td>{product.name}</td>
              <td>${product.unitPrice.toFixed(2)}</td>
              <td>{product.quantityInStock}</td>
              <td>
                <button className="edit-btn">Edit</button>
                <button className="delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
