import React from 'react';
import '../styles/Home.css';

export const Home = ({ setCurrentPage }) => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to JK Mobile Accessories</h1>
          <p>Your trusted partner for premium mobile accessories at affordable prices</p>
          <button className="hero-btn" onClick={() => setCurrentPage('inventory')}>
            📦 View Inventory
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Quality Products</h3>
            <p>High-quality mobile accessories from trusted brands</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>Best prices in the market without compromising quality</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Shipping</h3>
            <p>Quick delivery to your doorstep</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Customer Support</h3>
            <p>Excellent customer service and support</p>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="company-info">
        <h2>About Us</h2>
        <div className="company-details">
          <div className="info-block">
            <h3>📱 JK Mobile Accessories</h3>
            <p>We are a company that sells mobile accessories. We have a wide range of products, including phone cases, chargers, headphones, screen protectors, and much more.</p>
            <p>We are committed to providing our customers with high-quality products at affordable prices. We also offer excellent customer service and fast shipping.</p>
          </div>

          <div className="contact-block">
            <h3>📞 Contact Us</h3>
            <div className="contact-item">
              <span className="contact-label">Email:</span>
              <a href="mailto:jithendrasolanki56@gmail.com">jithendrasolanki56@gmail.com</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Phone:</span>
              <a href="tel:7816096147">+91 7816096147</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">Address:</span>
              <p>MG Road, YSR Circle Main Road, V. Kota - 517424</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Manage your inventory and billing efficiently with our system</p>
        <div className="cta-buttons">
          <button className="cta-btn primary" onClick={() => setCurrentPage('dashboard')}>
            📊 Go to Dashboard
          </button>
          <button className="cta-btn secondary" onClick={() => setCurrentPage('inventory')}>
            📦 Manage Products
          </button>
        </div>
      </section>
    </div>
  );
};
