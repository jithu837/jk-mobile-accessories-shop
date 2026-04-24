import React from 'react';
import { useShop } from '../context/ShopContext';
import '../styles/Dashboard.css';

export const Dashboard = ({ setCurrentPage }) => {
  const { getDashboardStats, getLowStockItems } = useShop();
  const stats = getDashboardStats();
  const lowStockItems = getLowStockItems();

  return (
    <div className="dashboard">
      <h1>📊 JK Mobile Accessories Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Total Customers</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Today's Sales</h3>
            <p className="stat-value">₹{stats.totalSales.toLocaleString()}</p>
            <small>{new Date().toLocaleDateString()}</small>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-info">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{stats.lowStockCount}</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="alert-section">
          <h2>⚠️ Low Stock Alert</h2>
          <div className="low-stock-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map(item => (
                  <tr key={item.id} className="low-stock-row">
                    <td>{item.name}</td>
                    <td className="quantity-low">{item.quantity} units</td>
                    <td>
                      <button 
                        className="btn btn-small btn-primary"
                        onClick={() => setCurrentPage('inventory')}
                      >
                        Reorder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button 
            className="action-btn"
            onClick={() => setCurrentPage('inventory')}
          >
            <span className="action-icon">📦</span>
            <span>Manage Inventory</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setCurrentPage('retail')}
          >
            <span className="action-icon">🛒</span>
            <span>Retail Billing</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setCurrentPage('wholesale')}
          >
            <span className="action-icon">📊</span>
            <span>Wholesale Billing</span>
          </button>
          <button 
            className="action-btn"
            onClick={() => setCurrentPage('balance')}
          >
            <span className="action-icon">💳</span>
            <span>Customer Balance</span>
          </button>
        </div>
      </div>
    </div>
  );
};
