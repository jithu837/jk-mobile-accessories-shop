import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/SalesHistory.css';

export const SalesHistory = () => {
  const { transactions, customers } = useShop();
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const getCustomerName = (customerId) => {
    if (!customerId) return 'Walk-in Customer';
    const customer = customers.find(c => c.id === customerId);
    return customer ? customer.name : 'Unknown';
  };

  // Flatten all transactions into individual sale items
  const allSaleItems = useMemo(() => {
    const items = [];
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        items.push({
          transactionId: transaction.id,
          customerId: transaction.customerId,
          customerName: getCustomerName(transaction.customerId),
          type: transaction.type,
          date: transaction.date,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity,
          transactionTotal: transaction.total,
          amountPaid: transaction.amountPaid || transaction.total,
        });
      });
    });
    // Sort by date descending (newest first)
    return items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, customers]);

  const filteredItems = useMemo(() => {
    return allSaleItems.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesSearch = !searchQuery || 
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDate = !dateFilter || 
        new Date(item.date).toISOString().split('T')[0] === dateFilter;
      return matchesType && matchesSearch && matchesDate;
    });
  }, [allSaleItems, filterType, searchQuery, dateFilter]);

  // Summary stats
  const totalSalesAmount = filteredItems.reduce((sum, item) => sum + item.total, 0);
  const totalQuantitySold = filteredItems.reduce((sum, item) => sum + item.quantity, 0);
  const uniqueTransactions = new Set(filteredItems.map(item => item.transactionId)).size;

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN'),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  return (
    <div className="sales-history">
      <h1>📜 Sales History</h1>

      {/* Summary Cards */}
      <div className="history-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p className="summary-value">₹{totalSalesAmount.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Items Sold</h3>
          <p className="summary-value">{totalQuantitySold}</p>
        </div>
        <div className="summary-card">
          <h3>Transactions</h3>
          <p className="summary-value">{uniqueTransactions}</p>
        </div>
        <div className="summary-card">
          <h3>Total Records</h3>
          <p className="summary-value">{filteredItems.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="history-filters">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search product or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="filter-row">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="retail">🛒 Retail</option>
            <option value="wholesale">📦 Wholesale</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          {(filterType !== 'all' || searchQuery || dateFilter) && (
            <button 
              className="btn btn-small btn-danger"
              onClick={() => { setFilterType('all'); setSearchQuery(''); setDateFilter(''); }}
            >
              ❌ Clear
            </button>
          )}
        </div>
      </div>

      {/* Sales Table */}
      <div className="history-table-wrapper">
        {filteredItems.length === 0 ? (
          <div className="no-data">No sales records found</div>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Customer</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => {
                const { date, time } = formatDateTime(item.date);
                return (
                  <tr key={`${item.transactionId}-${index}`}>
                    <td>
                      <div className="date-cell">
                        <span className="date">{date}</span>
                        <span className="time">{time}</span>
                      </div>
                    </td>
                    <td className="product-name">{item.productName}</td>
                    <td className="quantity">{item.quantity}</td>
                    <td>₹{item.price.toLocaleString()}</td>
                    <td className="item-total">₹{item.total.toLocaleString()}</td>
                    <td>{item.customerName}</td>
                    <td>
                      <span className={`type-badge ${item.type}`}>
                        {item.type === 'retail' ? '🛒' : '📦'} {item.type}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

