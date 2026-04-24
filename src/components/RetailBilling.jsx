import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/Billing.css';

const ProductImage = ({ product }) => {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
      />
    );
  }
  // Fallback emoji mapping
  const n = product.name.toLowerCase();
  let emoji = '📦';
  if (n.includes('case') || n.includes('cover')) emoji = '📱';
  else if (n.includes('cable') || n.includes('usb')) emoji = '🔌';
  else if (n.includes('screen') || n.includes('protector')) emoji = '🛡️';
  else if (n.includes('earbud') || n.includes('headphone') || n.includes('earphone')) emoji = '🎧';
  else if (n.includes('stand')) emoji = '📲';
  else if (n.includes('power') || n.includes('bank') || n.includes('charger')) emoji = '🔋';
  else if (n.includes('clean')) emoji = '🧼';
  return <span style={{ fontSize: '2.5rem' }}>{emoji}</span>;
};

export const RetailBilling = () => {
  const { products, createTransaction, addCustomer, addProduct } = useShop();
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '', category: 'accessories' });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { productId: product.id, name: product.name, price: product.price, quantity: 1 }]);
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  const handleQuantityChange = (productId, qty) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.productId === productId ? { ...item, quantity: qty } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleAddNewProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.quantity) {
      alert('Please fill all product fields');
      return;
    }
    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      quantity: parseInt(newProduct.quantity),
      category: newProduct.category,
    });
    setNewProduct({ name: '', price: '', quantity: '', category: 'accessories' });
    setShowAddProduct(false);
  };

  const handleCompleteSale = () => {
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }

    const total = calculateTotal();
    const paid = parseFloat(amountPaid) || total;

    // Auto-create anonymous retail customer to increase customer count
    const anonymousCustomer = addCustomer({
      name: `Retail Customer ${new Date().toLocaleTimeString()}`,
      phone: '-',
      type: 'retail'
    });

    createTransaction(anonymousCustomer.id, cartItems, 'retail', paid);
    alert(`Bill generated! Total: ₹${total} | Paid: ₹${paid}${paid < total ? ` | Pending: ₹${total - paid}` : ''}`);
    setCartItems([]);
    setAmountPaid('');
    setPaymentMethod('cash');
  };

  return (
    <div className="billing-container">
      <h1>🛒 Retail Billing System</h1>

      <div className="billing-layout">
        {/* Left - Products */}
        <div className="billing-left">
          <div className="section products-section">
            <div className="products-header">
              <h3>Available Products</h3>
              <button className="btn btn-small btn-success" onClick={() => setShowAddProduct(!showAddProduct)}>
                {showAddProduct ? '❌ Cancel' : '➕ Add Product'}
              </button>
            </div>

            {showAddProduct && (
              <div className="add-product-form">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                />
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                >
                  <option value="accessories">Accessories</option>
                  <option value="cables">Cables</option>
                  <option value="protection">Protection</option>
                  <option value="chargers">Chargers</option>
                </select>
                <button className="btn btn-small btn-success" onClick={handleAddNewProduct}>
                  ✅ Save Product
                </button>
              </div>
            )}

            <input
              type="text"
              className="search-bar"
              placeholder="🔍 Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

                <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image"><ProductImage product={product} /></div>
                  <h4>{product.name}</h4>
                  <p className="price">₹{product.price}</p>
                  <p className="stock">Stock: {product.quantity}</p>
                  <button
                    className="btn btn-small btn-primary"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    🛒 Add
                  </button>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p className="no-data">No products found</p>
              )}
            </div>
          </div>
        </div>

        {/* Right - Cart & Checkout */}
        <div className="billing-right">
          <div className="cart-section">
            <h3>🛒 Cart</h3>
            {cartItems.length === 0 ? (
              <p className="empty-cart">Cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.productId} className="cart-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-price">₹{item.price}</p>
                      </div>
                      <div className="item-quantity">
                        <button onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}>−</button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                        />
                        <button onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}>+</button>
                      </div>
                      <div className="item-total">
                        <p>₹{(item.price * item.quantity).toLocaleString()}</p>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveFromCart(item.productId)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="payment-section">
                  <h4>Payment Method</h4>
                  <div className="payment-options">
                    <label>
                      <input
                        type="radio"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      💵 Cash
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="phonepe"
                        checked={paymentMethod === 'phonepe'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      📱 PhonePe
                    </label>
                  </div>
                </div>

                <div className="payment-input">
                  <label>Amount Paid (₹)</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>

                <button className="btn btn-success btn-block" onClick={handleCompleteSale}>
                  ✅ Complete Sale
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

