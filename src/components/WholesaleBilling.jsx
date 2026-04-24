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

export const WholesaleBilling = () => {
  const { products, customers, createTransaction, addCustomer, updateCustomerBalance, getCustomerTransactions, addProduct } = useShop();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', shop: '' });
  const [discountPercent, setDiscountPercent] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '', category: 'accessories' });

  const wholesaleCustomers = customers.filter(c => c.type === 'wholesale');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product, bulk = false) => {
    const existingItem = cartItems.find(item => item.productId === product.id);
    const qty = bulk ? 10 : 1;

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCartItems([...cartItems, { productId: product.id, name: product.name, price: product.price, quantity: qty }]);
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

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * discountPercent) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleAddNewCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.shop) {
      alert('Please fill all customer details');
      return;
    }
    const customer = addCustomer({ name: newCustomer.name, phone: newCustomer.phone, shop: newCustomer.shop, type: 'wholesale' });
    setSelectedCustomer(customer);
    setNewCustomer({ name: '', phone: '', shop: '' });
    setShowNewCustomer(false);
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

    if (selectedCustomer) {
      updateCustomerBalance(selectedCustomer.id, paid);
    }

    createTransaction(selectedCustomer?.id || null, cartItems, 'wholesale', paid);
    alert(`Wholesale bill generated! Total: ₹${total.toLocaleString()} | Paid: ₹${paid}${paid < total ? ` | Pending: ₹${total - paid}` : ''}`);
    setCartItems([]);
    setSelectedCustomer(null);
    setDiscountPercent(0);
    setPaymentMethod('cash');
    setAmountPaid('');
  };

  const handleViewHistory = (customer) => {
    setSelectedCustomerHistory(customer);
    setShowHistory(true);
  };

  const transactions = selectedCustomerHistory ? getCustomerTransactions(selectedCustomerHistory.id) : [];

  return (
    <div className="billing-container wholesale">
      <h1>📊 Wholesale Billing System</h1>

      <div className="billing-layout">
        {/* Left - Customer & Products */}
        <div className="billing-left">
          {/* Customer Selection */}
          <div className="section customer-section">
            <h3>Select Wholesale Customer (Optional)</h3>
            <div className="customer-selection">
              {!showNewCustomer ? (
                <>
                  <select
                    value={selectedCustomer?.id || ''}
                    onChange={(e) => setSelectedCustomer(wholesaleCustomers.find(c => c.id === parseInt(e.target.value)))}
                  >
                    <option value="">Direct Sale (No Customer)</option>
                    {wholesaleCustomers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.phone})
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-small btn-primary" onClick={() => setShowNewCustomer(true)}>
                    ➕ New Wholesaler
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Shop Owner Name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Shop Name"
                    value={newCustomer.shop}
                    onChange={(e) => setNewCustomer({ ...newCustomer, shop: e.target.value })}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                  <div className="button-group">
                    <button className="btn btn-small btn-success" onClick={handleAddNewCustomer}>
                      ✅ Add
                    </button>
                    <button className="btn btn-small btn-danger" onClick={() => setShowNewCustomer(false)}>
                      ❌ Cancel
                    </button>
                  </div>
                </>
              )}
            </div>

            {selectedCustomer && (
              <div className="customer-info">
                <p><strong>Owner:</strong> {selectedCustomer.name}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <p><strong>Outstanding Balance:</strong> ₹{selectedCustomer.balance.toLocaleString()}</p>
                <button className="btn btn-small btn-info" onClick={() => handleViewHistory(selectedCustomer)}>
                  📋 View History
                </button>
              </div>
            )}
          </div>

          {/* Search & Add Product */}
          <div className="section products-section">
            <div className="products-header">
              <h3>Available Products (Bulk Quantities)</h3>
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
                  <div className="bulk-actions">
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => handleAddToCart(product, true)}
                      disabled={product.quantity < 10}
                      title="Add 10 units"
                    >
                      +10
                    </button>
                    <button
                      className="btn btn-small btn-primary"
                      onClick={() => handleAddToCart(product, false)}
                      disabled={product.quantity === 0}
                      title="Add 1 unit"
                    >
                      +1
                    </button>
                  </div>
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
            <h3>📦 Wholesale Cart</h3>
            {cartItems.length === 0 ? (
              <p className="empty-cart">Cart is empty</p>
            ) : (
              <>
                <div className="cart-items">
                  {cartItems.map(item => (
                    <div key={item.productId} className="cart-item">
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p className="item-price">₹{item.price}/unit</p>
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

                {/* Discount Section */}
                <div className="discount-section">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Math.min(Math.max(0, parseFloat(e.target.value)), 100))}
                    min="0"
                    max="100"
                  />
                  <p className="discount-amount">Discount: -₹{calculateDiscount().toLocaleString()}</p>
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{calculateSubtotal().toLocaleString()}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="summary-row">
                      <span>Discount ({discountPercent}%):</span>
                      <span>-₹{calculateDiscount().toLocaleString()}</span>
                    </div>
                  )}
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
                  ✅ Complete Sale & Reduce Inventory
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && selectedCustomerHistory && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowHistory(false)}>&times;</span>
            <h3>Wholesale History - {selectedCustomerHistory.name}</h3>
            {transactions.length === 0 ? (
              <p>No transactions found</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id}>
                      <td>{new Date(t.date).toLocaleString()}</td>
                      <td>{t.items.reduce((sum, i) => sum + i.quantity, 0)} items</td>
                      <td>₹{t.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

