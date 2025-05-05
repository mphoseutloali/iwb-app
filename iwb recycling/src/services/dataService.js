
import React from "react";

// Constants for storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'iwb_products',
  FINANCIAL_DATA: 'iwb_financial_data',
  QUERIES: 'iwb_queries',
  PURCHASES: 'iwb_purchases',
  BACKUP_PREFIX: 'iwb_backup_'
};

// Helper to handle storage operations with error handling
const safeStorage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
      return false;
    }
  }
};

// Products operations
export const productService = {
  getAll: () => safeStorage.get(STORAGE_KEYS.PRODUCTS) || [],
  
  add: (product) => {
    const products = productService.getAll();
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    safeStorage.set(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },
  
  update: (id, updates) => {
    const products = productService.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      safeStorage.set(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    }
    return null;
  },
  
  delete: (id) => {
    const products = productService.getAll();
    const filtered = products.filter(p => p.id !== id);
    safeStorage.set(STORAGE_KEYS.PRODUCTS, filtered);
  },

  getPurchaseHistory: () => safeStorage.get(STORAGE_KEYS.PURCHASES) || [],

  addPurchase: (purchase) => {
    const purchases = productService.getPurchaseHistory();
    purchases.push(purchase);
    safeStorage.set(STORAGE_KEYS.PURCHASES, purchases);
    return purchase;
  },

  backup: () => {
    const products = productService.getAll();
    const purchases = productService.getPurchaseHistory();
    const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}products_${Date.now()}`;
    safeStorage.set(backupKey, { products, purchases });
    return backupKey;
  }
};

// Financial data operations
export const financeService = {
  getData: () => safeStorage.get(STORAGE_KEYS.FINANCIAL_DATA) || {
    revenue: [],
    expenses: [],
    profit: [],
    monthlyStatements: []
  },
  
  updateData: (data) => {
    safeStorage.set(STORAGE_KEYS.FINANCIAL_DATA, data);
    return data;
  },
  
  addMonthlyStatement: (statement) => {
    const data = financeService.getData();
    data.monthlyStatements.push({
      ...statement,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
    
    // Update summary data
    data.revenue.push(statement.revenue);
    data.expenses.push(statement.expenses);
    data.profit.push(statement.revenue - statement.expenses);
    
    safeStorage.set(STORAGE_KEYS.FINANCIAL_DATA, data);
    return data;
  },

  backup: () => {
    const data = financeService.getData();
    const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}finance_${Date.now()}`;
    safeStorage.set(backupKey, data);
    return backupKey;
  }
};

// Query management
export const queryService = {
  getAll: () => safeStorage.get(STORAGE_KEYS.QUERIES) || [],
  
  add: (query) => {
    const queries = queryService.getAll();
    const queryNumber = queries.length + 1;
    const newQuery = {
      ...query,
      id: Date.now(),
      queryNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    queries.push(newQuery);
    safeStorage.set(STORAGE_KEYS.QUERIES, queries);
    return newQuery;
  },
  
  updateStatus: (id, status, response) => {
    const queries = queryService.getAll();
    const index = queries.findIndex(q => q.id === id);
    if (index !== -1) {
      queries[index] = {
        ...queries[index],
        status,
        response,
        respondedAt: new Date().toISOString()
      };
      safeStorage.set(STORAGE_KEYS.QUERIES, queries);
      return queries[index];
    }
    return null;
  },

  backup: () => {
    const queries = queryService.getAll();
    const backupKey = `${STORAGE_KEYS.BACKUP_PREFIX}queries_${Date.now()}`;
    safeStorage.set(backupKey, queries);
    return backupKey;
  }
};

// Backup all data
export const backupAllData = () => {
  const timestamp = Date.now();
  const backups = {
    products: productService.backup(),
    finance: financeService.backup(),
    queries: queryService.backup()
  };
  
  // Store backup metadata
  safeStorage.set(`${STORAGE_KEYS.BACKUP_PREFIX}metadata_${timestamp}`, {
    timestamp,
    backups
  });
  
  return backups;
};
