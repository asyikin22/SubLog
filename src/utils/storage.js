// Enhanced IndexedDB storage utility for SubLog - Multi-Category Finance Tracker
const DB_NAME = 'SubLogDB';
const DB_VERSION = 2; // Increment version for new stores
const SUBSCRIPTIONS_STORE = 'subscriptions';
const EXPENSES_STORE = 'expenses';
const BNPL_STORE = 'bnpl';
const ACCOUNTS_STORE = 'accounts';

// Open IndexedDB connection with upgraded schema
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Subscriptions store (existing)
      if (!db.objectStoreNames.contains(SUBSCRIPTIONS_STORE)) {
        const subscriptionsStore = db.createObjectStore(SUBSCRIPTIONS_STORE, { keyPath: 'id' });
        subscriptionsStore.createIndex('name', 'name', { unique: false });
        subscriptionsStore.createIndex('category', 'category', { unique: false });
      }
      
      // Large expenses store (new)
      if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
        const expensesStore = db.createObjectStore(EXPENSES_STORE, { keyPath: 'id' });
        expensesStore.createIndex('name', 'name', { unique: false });
        expensesStore.createIndex('category', 'category', { unique: false });
        expensesStore.createIndex('nextDue', 'nextDue', { unique: false });
      }
      
      // BNPL store (new)
      if (!db.objectStoreNames.contains(BNPL_STORE)) {
        const bnplStore = db.createObjectStore(BNPL_STORE, { keyPath: 'id' });
        bnplStore.createIndex('name', 'name', { unique: false });
        bnplStore.createIndex('nextDue', 'nextDue', { unique: false });
      }
      
      // Accounts store (new)
      if (!db.objectStoreNames.contains(ACCOUNTS_STORE)) {
        const accountsStore = db.createObjectStore(ACCOUNTS_STORE, { keyPath: 'id' });
      }
    };
  });
};

// ======================
// EXISTING SUBSCRIPTION FUNCTIONS (keep your exact logic)
// ======================

export const getSubscriptions = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readonly');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting subscriptions:', error);
    return [];
  }
};

export const saveSubscriptions = async (subscriptions) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });
    
    const promises = subscriptions.map(subscription => {
      return new Promise((resolve, reject) => {
        const request = store.add(subscription);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error saving subscriptions:', error);
    return false;
  }
};

export const addSubscription = async (subscription) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(subscription);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error adding subscription:', error);
    throw error;
  }
};

export const updateSubscription = async (subscription) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(subscription);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

export const deleteSubscription = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

// ======================
// NEW EXPENSE FUNCTIONS
// ======================

export const getExpenses = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readonly');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting expenses:', error);
    return [];
  }
};

export const addExpense = async (expense) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(expense);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (expense) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(expense);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// ======================
// NEW BNPL FUNCTIONS
// ======================

export const getBNPLItems = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readonly');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting BNPL items:', error);
    return [];
  }
};

export const addBNPLItem = async (bnplItem) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readwrite');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(bnplItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error adding BNPL item:', error);
    throw error;
  }
};

export const updateBNPLItem = async (bnplItem) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readwrite');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(bnplItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error updating BNPL item:', error);
    throw error;
  }
};

export const deleteBNPLItem = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readwrite');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error deleting BNPL item:', error);
    throw error;
  }
};

// ======================
// NEW ACCOUNT FUNCTIONS
// ======================

export const getAccounts = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([ACCOUNTS_STORE], 'readonly');
    const store = transaction.objectStore(ACCOUNTS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.get('accounts');
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : { checking: 0, savings: 0 });
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting accounts:', error);
    return { checking: 0, savings: 0 };
  }
};

export const updateAccounts = async (accounts) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([ACCOUNTS_STORE], 'readwrite');
    const store = transaction.objectStore(ACCOUNTS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'accounts', data: accounts });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error updating accounts:', error);
    throw error;
  }
};

// ======================
// UTILITY FUNCTIONS (keep your existing ones)
// ======================

export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

export const formatCurrency = (amount) => {
  return `RM${parseFloat(amount).toFixed(2)}`;
};

// New utility functions for enhanced calculations
export const calculateMonthlyCost = (amount, billingCycle) => {
  return billingCycle === 'yearly' ? amount / 12 : amount;
};

export const getDaysUntil = (targetDate) => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getUpcomingPayments = (items, daysThreshold = 7) => {
  return items
    .map(item => ({
      ...item,
      daysUntil: getDaysUntil(item.nextPayment || item.nextDue)
    }))
    .filter(item => item.daysUntil <= daysThreshold && item.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
};