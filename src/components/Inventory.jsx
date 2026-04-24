import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/Inventory.css';

export const Inventory = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useShop();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'accessories',
    image: '',
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.quantity) {
      alert('Please fill all fields');
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        image: formData.image,
      });
      setEditingId(null);
    } else {
      addProduct({
        name: formData.name,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        image: formData.image,
      });
    }

    setFormData({ name: '', price: '', quantity: '', category: 'accessories', image: '' });
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
      image: product.image || '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="inventory">
      <h1>📦 Inventory Management</h1>

      <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
        {showForm ? '❌ Cancel' : '➕ Add New Product'}
      </button>

      {showForm && (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., iPhone Case"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="500"
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                <option value="accessories">Accessories</option>
                <option value="cables">Cables</option>
                <option value="protection">Protection</option>
                <option value="chargers">Chargers</option>
              </select>
            </div>
            <div className="form-group">
              <label>Image URL (Google Images / any link)</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="Paste image URL here..."
              />
              <small style={{ color: '#666', fontSize: '0.8rem' }}>
                Tip: Right-click image on Google → "Copy image address"
              </small>
            </div>
            <button type="submit" className="btn btn-success">
              {editingId ? '✏️ Update Product' : '✅ Add Product'}
            </button>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="search-section" style={{ margin: '1.5rem 0' }}>
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', borderRadius: '8px', border: '1px solid #ddd' }}
        />
      </div>

      <div className="inventory-table">
        <h2>Products List ({filteredProducts.length})</h2>
        {filteredProducts.length === 0 ? (
          <p className="no-data">{searchQuery ? 'No products match your search' : 'No products added yet'}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <span style={{ fontSize: '1.5rem' }}>📦</span>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td className={product.quantity <= 20 ? 'low-stock' : ''}>
                    {product.quantity} units
                  </td>
                  <td>{product.category}</td>
                  <td className="action-buttons">
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(product.id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

