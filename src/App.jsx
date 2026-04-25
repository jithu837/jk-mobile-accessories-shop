import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { RetailBilling } from './components/RetailBilling';
import { WholesaleBilling } from './components/WholesaleBilling';
import { CustomerBalance } from './components/CustomerBalance';
import { SalesHistory } from './components/SalesHistory';
import { AdminLogin } from './components/AdminLogin';
import './App.css';

function AppContent() {
  const { isAdminLoggedIn, logoutAdmin } = useShop();
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(false);

  // Handle page changes with loading state
  const handlePageChange = (page) => {
    setIsLoading(true);
    setCurrentPage(page);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleLogout = () => {
    logoutAdmin();
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={handlePageChange} />;
      case 'dashboard':
        return <Dashboard setCurrentPage={handlePageChange} />;
      case 'inventory':
        return <Inventory />;
      case 'retail':
        return <RetailBilling />;
      case 'wholesale':
        return <WholesaleBilling />;
      case 'balance':
        return <CustomerBalance />;
      case 'sales':
        return <SalesHistory />;
      default:
        return <Home setCurrentPage={handlePageChange} />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'retail', label: 'Retail', icon: '🛒' },
    { id: 'wholesale', label: 'Wholesale', icon: '📊' },
    { id: 'balance', label: 'Balance', icon: '💳' },
    { id: 'sales', label: 'Sales History', icon: '📜' },
  ];

  // Show login page if not authenticated
  if (!isAdminLoggedIn) {
    return <AdminLogin />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1>📱 JK Mobile Accessories</h1>
          </div>

          <ul className="nav-menu">
            {navItems.map(item => (
              <li key={item.id}>
                <button
                  className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                  onClick={() => handlePageChange(item.id)}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </button>
              </li>
            ))}
            <li>
              <button
                className="nav-link logout-btn"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <span className="nav-icon">🚪</span>
                <span className="nav-text">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-company">
            <p>&copy; 2024 JK Mobile Accessories. All rights reserved.</p>
            <p className="company-tagline">High-quality mobile accessories at affordable prices</p>
          </div>
          <div className="footer-contact">
            <div className="contact-item">
              <span className="contact-label">📧 Email:</span>
              <span>jithendrasolanki56@gmail.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">📞 Phone:</span>
              <span>7816096147</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">📍 Address:</span>
              <span>MG Road, YSR Circle Main Road, V.Kota-517424</span>
            </div>
          </div>
          <div className="footer-info">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Built with React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}

export default App;

