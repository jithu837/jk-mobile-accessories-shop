import React, { createContext, useState, useCallback } from 'react';

export const ShopContext = createContext();

const defaultProducts = [
  { id: 1, name: 'iPhone 13 Case', price: 500, quantity: 50, category: 'accessories', description: 'Premium protective case', image: 'https://picsum.photos/seed/iphonecase/150/150' },
  { id: 2, name: 'Samsung Galaxy Case', price: 400, quantity: 30, category: 'accessories', description: 'Durable hard case', image: 'https://picsum.photos/seed/samsungcase/150/150' },
  { id: 3, name: 'USB-C Cable', price: 200, quantity: 100, category: 'cables', description: 'Fast charging cable', image: 'https://picsum.photos/seed/usbcable/150/150' },
  { id: 4, name: 'Screen Protector', price: 150, quantity: 80, category: 'protection', description: 'Tempered glass', image: 'https://picsum.photos/seed/screenprotector/150/150' },
  { id: 5, name: 'Wireless Earbuds', price: 1500, quantity: 25, category: 'headphones', description: 'Noise cancelling', image: 'https://picsum.photos/seed/earbuds/150/150' },
  { id: 6, name: 'Mobile Stand', price: 300, quantity: 45, category: 'accessories', description: 'Foldable stand', image: 'https://picsum.photos/seed/mobilestand/150/150' },
  { id: 7, name: 'USB Power Bank', price: 800, quantity: 35, category: 'chargers', description: '20000 mAh capacity', image: 'https://picsum.photos/seed/powerbank/150/150' },
  { id: 8, name: 'Screen Cleaning Kit', price: 100, quantity: 60, category: 'cleaning', description: 'Microfiber cloth included', image: 'https://picsum.photos/seed/cleaningkit/150/150' },
];

const defaultCustomers = [];

const defaultTransactions = [];

// Initialize from localStorage or use defaults
const getInitialState = (key, defaultValue) => {
  try {
    const stored = localStorage.getItem(`shop_${key}`);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

// Helper to check if a date string is today
const isToday = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const ShopProvider = ({ children }) => {
  // State management with localStorage
  const [products, setProducts] = useState(() => getInitialState('products', defaultProducts));
  const [customers, setCustomers] = useState(() => getInitialState('customers', defaultCustomers));
  const [transactions, setTransactions] = useState(() => getInitialState('transactions', defaultTransactions));
  const [lowStockThreshold, setLowStockThreshold] = useState(() => getInitialState('lowStockThreshold', 20));

  // Save to localStorage helper
  const saveToStorage = (key, value) => {
    try {
      localStorage.setItem(`shop_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Product Management
  const addProduct = useCallback((product) => {
    const newProduct = { ...product, id: Date.now() };
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
  }, [products]);

  const updateProduct = useCallback((id, updatedData) => {
    const updatedProducts = products.map(p => p.id === id ? { ...p, ...updatedData } : p);
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
  }, [products]);

  const deleteProduct = useCallback((id) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    saveToStorage('products', updatedProducts);
  }, [products]);

  // Customer Management
  const addCustomer = useCallback((customer) => {
    const newCustomer = { ...customer, id: Date.now(), balance: 0 };
    const updatedCustomers = [...customers, newCustomer];
    setCustomers(updatedCustomers);
    saveToStorage('customers', updatedCustomers);
    return newCustomer;
  }, [customers]);

  const updateCustomerBalance = useCallback((customerId, amount) => {
    const updatedCustomers = customers.map(c =>
      c.id === customerId ? { ...c, balance: c.balance + amount } : c
    );
    setCustomers(updatedCustomers);
    saveToStorage('customers', updatedCustomers);
  }, [customers]);

  const getCustomer = useCallback((id) => {
    return customers.find(c => c.id === id);
  }, [customers]);

  // Billing
  const createTransaction = useCallback((customerId, items, transactionType, amountPaid) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const newTransaction = {
      id: Date.now(),
      customerId,
      type: transactionType,
      items,
      total,
      amountPaid: amountPaid || total,
      date: new Date().toISOString(),
      status: 'completed',
    };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveToStorage('transactions', updatedTransactions);

    // Update product quantities
    items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        updateProduct(product.id, { quantity: product.quantity - item.quantity });
      }
    });

    return newTransaction;
  }, [products, transactions, updateProduct]);

  // Get low stock items
  const getLowStockItems = useCallback(() => {
    return products.filter(p => p.quantity <= lowStockThreshold);
  }, [products, lowStockThreshold]);

  // Get dashboard stats (today only)
  const getDashboardStats = useCallback(() => {
    const lowStockItems = getLowStockItems();
    const todaysTransactions = transactions.filter(t => isToday(t.date));
    const totalSales = todaysTransactions.reduce((sum, t) => sum + (t.amountPaid || t.total), 0);
    const totalProducts = products.length;
    const totalCustomers = customers.length;

    return {
      totalProducts,
      totalCustomers,
      totalSales,
      lowStockCount: lowStockItems.length,
      lowStockItems,
    };
  }, [products, customers, transactions, getLowStockItems]);

  // Get customer transactions (today only)
  const getCustomerTransactions = useCallback((customerId) => {
    return transactions.filter(t => t.customerId === customerId && isToday(t.date));
  }, [transactions]);

  // Get transactions by type (today only)
  const getTransactionsByType = useCallback((type) => {
    return transactions.filter(t => t.type === type && isToday(t.date));
  }, [transactions]);

  // Wrapped setLowStockThreshold to save to storage
  const handleSetLowStockThreshold = useCallback((threshold) => {
    setLowStockThreshold(threshold);
    saveToStorage('lowStockThreshold', threshold);
  }, []);

  const value = {
    // State
    products,
    customers,
    transactions,
    lowStockThreshold,
    setLowStockThreshold: handleSetLowStockThreshold,

    // Product methods
    addProduct,
    updateProduct,
    deleteProduct,

    // Customer methods
    addCustomer,
    updateCustomerBalance,
    getCustomer,

    // Transaction methods
    createTransaction,
    getCustomerTransactions,
    getTransactionsByType,

    // Analytics
    getDashboardStats,
    getLowStockItems,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = React.useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within ShopProvider');
  }
  return context;
};
