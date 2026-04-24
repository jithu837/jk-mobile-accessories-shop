import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/Balance.css';

export const CustomerBalance = () => {
  const { customers, updateCustomerBalance, getCustomerTransactions } = useShop();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [filter, setFilter] = useState('all');

  const handlePayment = () => {
    if (!selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const amount = parseFloat(paymentAmount);

    if (amount > selectedCustomer.balance) {
      alert(`Amount exceeds balance. Outstanding balance: ₹${selectedCustomer.balance}`);
      return;
    }

    updateCustomerBalance(selectedCustomer.id, -amount);
    alert(`Payment of ₹${amount} received successfully!`);
    setPaymentAmount('');
    setShowPayment(false);
    setSelectedCustomer(null);
  };

  const getFilteredCustomers = () => {
    if (filter === 'retail') return customers.filter(c => c.type === 'retail');
    if (filter === 'wholesale') return customers.filter(c => c.type === 'wholesale');
    if (filter === 'outstanding') return customers.filter(c => c.balance > 0);
    return customers;
  };

  const filteredCustomers = getFilteredCustomers();
  const totalOutstanding = customers.reduce((sum, c) => sum + c.balance, 0);
  const customerTransactions = selectedCustomer ? getCustomerTransactions(selectedCustomer.id) : [];

  return (
    <div className="balance-container">
      <h1>💳 Customer Balance & Payment Tracking</h1>

      {/* Summary Cards */}
      <div className="balance-summary">
        <div className="summary-card">
          <h3>Total Customers</h3>
          <p className="summary-value">{customers.length}</p>
        </div>
        <div className="summary-card">
          <h3>Customers with Balance</h3>
          <p className="summary-value">{customers.filter(c => c.balance > 0).length}</p>
        </div>
        <div className="summary-card warning">
          <h3>Total Outstanding</h3>
          <p className="summary-value">₹{totalOutstanding.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Customers
          </button>
          <button
            className={`filter-btn ${filter === 'retail' ? 'active' : ''}`}
            onClick={() => setFilter('retail')}
          >
            Retail
          </button>
          <button
            className={`filter-btn ${filter === 'wholesale' ? 'active' : ''}`}
            onClick={() => setFilter('wholesale')}
          >
            Wholesale
          </button>
          <button
            className={`filter-btn ${filter === 'outstanding' ? 'active' : ''}`}
            onClick={() => setFilter('outstanding')}
          >
            Outstanding Only
          </button>
        </div>
      </div>

      <div className="balance-layout">
        {/* Left - Customer List */}
        <div className="balance-left">
          <h2>Customer List</h2>
          <div className="customer-list">
            {filteredCustomers.length === 0 ? (
              <p className="no-data">No customers found</p>
            ) : (
              filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  className={`customer-item ${selectedCustomer?.id === customer.id ? 'selected' : ''} ${customer.balance > 0 ? 'has-balance' : ''}`}
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <div className="customer-main">
                    <h4>{customer.name}</h4>
                    <p className="customer-phone">📱 {customer.phone}</p>
                    {customer.type === 'wholesale' && customer.shop && (
                      <p className="customer-shop">🏪 {customer.shop}</p>
                    )}
                  </div>
                  <div className="customer-balance">
                    <span className={`balance-badge ${customer.balance > 0 ? 'outstanding' : 'clear'}`}>
                      ₹{customer.balance.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right - Customer Details & Payment */}
        <div className="balance-right">
          {selectedCustomer ? (
            <>
              <div className="customer-details">
                <h2>Customer Details</h2>
                <div className="detail-info">
                  <p><strong>Name:</strong> {selectedCustomer.name}</p>
                  <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                  <p><strong>Type:</strong> {selectedCustomer.type === 'retail' ? '🛒 Retail' : '📦 Wholesale'}</p>
                  {selectedCustomer.type === 'wholesale' && selectedCustomer.shop && (
                    <p><strong>Shop:</strong> {selectedCustomer.shop}</p>
                  )}
                  <div className="balance-display">
                    <h3 className={selectedCustomer.balance > 0 ? 'outstanding' : 'clear'}>
                      Outstanding Balance: ₹{selectedCustomer.balance.toLocaleString()}
                    </h3>
                  </div>
                </div>

                {selectedCustomer.balance > 0 && (
                  <>
                    {!showPayment ? (
                      <button className="btn btn-primary" onClick={() => setShowPayment(true)}>
                        💰 Record Payment
                      </button>
                    ) : (
                      <div className="payment-form">
                        <label>Payment Amount (₹)</label>
                        <input
                          type="number"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder={`Max: ₹${selectedCustomer.balance}`}
                          max={selectedCustomer.balance}
                        />
                        <div className="payment-button-group">
                          <button className="btn btn-success" onClick={handlePayment}>
                            ✅ Confirm Payment
                          </button>
                          <button className="btn btn-danger" onClick={() => {
                            setShowPayment(false);
                            setPaymentAmount('');
                          }}>
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedCustomer.balance === 0 && (
                  <div className="balance-clear">
                    <p>✅ No outstanding balance</p>
                  </div>
                )}
              </div>

              {/* Transaction History */}
              <div className="transaction-history">
                <h2>Transaction History</h2>
                {customerTransactions.length === 0 ? (
                  <p className="no-data">No transactions found</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Items</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerTransactions.map(transaction => (
                        <tr key={transaction.id}>
                          <td>{new Date(transaction.date).toLocaleString()}</td>
                          <td>
                            <span className={`type-badge ${transaction.type}`}>
                              {transaction.type === 'retail' ? '🛒' : '📦'} {transaction.type}
                            </span>
                          </td>
                          <td>{transaction.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                          <td>₹{transaction.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a customer to view details and manage payments</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Table */}
      <div className="summary-table-section">
        <h2>All Customers Summary</h2>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Type</th>
              <th>Phone</th>
              <th>Transactions</th>
              <th>Outstanding Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td><strong>{customer.name}</strong></td>
                <td>{customer.type === 'retail' ? '🛒 Retail' : '📦 Wholesale'}</td>
                <td>{customer.phone}</td>
                <td>{getCustomerTransactions(customer.id).length}</td>
                <td className={customer.balance > 0 ? 'outstanding-amount' : ''}>
                  ₹{customer.balance.toLocaleString()}
                </td>
                <td>
                  <span className={`status-badge ${customer.balance > 0 ? 'pending' : 'clear'}`}>
                    {customer.balance > 0 ? '⚠️ Pending' : '✅ Clear'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
