# 📱 Mobile Shop Management System

A comprehensive React-based application designed to manage retail and wholesale operations for a mobile accessories shop. The system provides inventory management, billing, customer balance tracking, and low stock alerts.

## ✨ Features

### 1. **📊 Dashboard**
- Overview of key metrics (Total Products, Customers, Sales, Low Stock Items)
- Low stock alerts with quick reorder buttons
- Quick action buttons to navigate to different sections

### 2. **📦 Inventory Management**
- Add new products with details (Name, Price, Quantity, Category)
- Edit and delete existing products
- Real-time stock tracking
- Low stock alert system
- Automatic reorder creation for items below threshold
- Track pending orders

### 3. **🛒 Retail Billing System**
- Customer selection and creation
- Add products to cart with quantity management
- Multiple payment methods (Cash, Card, Credit)
- Real-time bill calculation
- Customer balance tracking for credit purchases
- View customer transaction history
- Support for new customer registration during billing

### 4. **📊 Wholesale Billing System**
- Separate billing for wholesale customers
- Bulk quantity additions (+1, +10 units)
- Discount system for wholesale orders
- Automatic balance addition for wholesale transactions
- Track wholesale-specific customer information (Shop Name)
- Detailed wholesale transaction history

### 5. **💳 Customer Balance & Payment Tracking**
- View all customers and their outstanding balances
- Filter by customer type (Retail, Wholesale) or payment status
- Record payments and reduce customer balance
- View complete transaction history per customer
- Summary statistics (Total Customers, Pending Balances, etc.)
- Comprehensive customer summary table

### 6. **⚠️ Low Stock Alert & Order System**
- Automatic monitoring of inventory levels
- Configurable low stock threshold
- Visual alerts on dashboard
- One-click reorder creation
- Track pending orders with status

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to project directory:**
   ```bash
   cd my-react-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
src/
├── context/
│   └── ShopContext.jsx          # Global state management
├── components/
│   ├── Dashboard.jsx             # Dashboard page
│   ├── Inventory.jsx             # Inventory management
│   ├── RetailBilling.jsx         # Retail billing system
│   ├── WholesaleBilling.jsx      # Wholesale billing system
│   └── CustomerBalance.jsx       # Balance tracking
├── styles/
│   ├── Dashboard.css
│   ├── Inventory.css
│   ├── Billing.css
│   └── Balance.css
├── App.jsx                       # Main app component
├── App.css                       # Main app styles
├── main.jsx                      # Entry point
└── index.css                     # Global styles
```

## 🎯 Usage

### Managing Inventory
1. Navigate to **📦 Inventory** from the navigation bar
2. Click **➕ Add New Product** to add items
3. Fill in product details (Name, Price, Quantity, Category)
4. View all products in the table
5. Use **✏️ Edit** or **🗑️ Delete** buttons to modify inventory

### Retail Billing
1. Go to **🛒 Retail** section
2. Select an existing customer or create a new one
3. Click **🛒 Add** on products to add to cart
4. Adjust quantities using +/- buttons
5. Select payment method (Cash, Card, or Credit)
6. Click **✅ Complete Sale** to finalize the transaction

### Wholesale Billing
1. Navigate to **📊 Wholesale** section
2. Select a wholesaler or create a new wholesale account
3. Use **+10** and **+1** buttons for bulk additions
4. Apply discounts if needed
5. View the summary and click **✅ Create Bill & Add to Balance**

### Tracking Customer Balance
1. Go to **💳 Balance** section
2. Filter customers by type or outstanding status
3. Select a customer to view details
4. Click **💰 Record Payment** to add a payment
5. View transaction history in the table below

## 💾 Data Management

The application uses React Context API for state management. All data (products, customers, transactions) is stored in memory and will reset when the page is refreshed. For production use, integrate with a backend database.

### Sample Data Included
- 4 pre-loaded products (iPhone Case, Samsung Case, USB Cable, Screen Protector)
- 2 sample customers (1 Retail, 1 Wholesale)
- 1 sample transaction

## 🎨 Features & Customization

### Themes & Colors
- Primary Color: #667eea (Purple/Blue Gradient)
- Secondary: #764ba2
- Success: #56ab2f
- Danger: #f5576c

### Low Stock Threshold
- Default threshold: 20 units
- Can be adjusted in the Inventory context

### Payment Methods
- Cash
- Card
- Credit (adds to customer balance)

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1400px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🔧 Technologies Used

- **React 19.2.5** - UI Framework
- **Vite 8.0** - Build tool
- **CSS3** - Styling with Flexbox & Grid
- **JavaScript ES6+** - Core language

## 📋 Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication and role-based access
- Bill printing and PDF export
- Advanced reporting and analytics
- Email notifications for low stock
- Multiple store/branch support
- Barcode scanning integration
- SMS alerts for customer balance

## 🐛 Known Limitations

- Data persists only during the session (in-memory)
- No persistent storage backend
- Limited to single-store operations
- No user authentication

## 📞 Support

For issues or feature requests, please refer to the documentation or create an issue in the repository.

---

**Version:** 1.0.0  
**Last Updated:** April 2024  
**License:** MIT
