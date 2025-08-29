// Enhanced IndexedDB storage utility for SubLog - Multi-Category Finance Tracker with Goals
const DB_NAME = 'SubLogDB';
const DB_VERSION = 5; // Increment version for wishlist addition
const SUBSCRIPTIONS_STORE = 'subscriptions';
const EXPENSES_STORE = 'expenses';
const BNPL_STORE = 'bnpl';
const ACCOUNTS_STORE = 'accounts';
const SAVINGS_GOALS_STORE = 'savingsGoals';
const LIFE_GOALS_STORE = 'lifeGoals';
const WISHLIST_STORE = 'wishlist'; // New store for wishlist items

// Open IndexedDB connection with upgraded schema
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Subscriptions store
      if (!db.objectStoreNames.contains(SUBSCRIPTIONS_STORE)) {
        const subscriptionsStore = db.createObjectStore(SUBSCRIPTIONS_STORE, { keyPath: 'id' });
        subscriptionsStore.createIndex('name', 'name', { unique: false });
        subscriptionsStore.createIndex('category', 'category', { unique: false });
        subscriptionsStore.createIndex('nextPayment', 'nextPayment', { unique: false });
      }
      
      // Large expenses store
      if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
        const expensesStore = db.createObjectStore(EXPENSES_STORE, { keyPath: 'id' });
        expensesStore.createIndex('name', 'name', { unique: false });
        expensesStore.createIndex('category', 'category', { unique: false });
        expensesStore.createIndex('nextDue', 'nextDue', { unique: false });
      }
      
      // BNPL store - FIXED: Use nextPaymentDate consistently
      if (!db.objectStoreNames.contains(BNPL_STORE)) {
        const bnplStore = db.createObjectStore(BNPL_STORE, { keyPath: 'id' });
        bnplStore.createIndex('itemName', 'itemName', { unique: false });
        bnplStore.createIndex('nextPaymentDate', 'nextPaymentDate', { unique: false });
        bnplStore.createIndex('platform', 'platform', { unique: false });
      }
      
      // Accounts store
      if (!db.objectStoreNames.contains(ACCOUNTS_STORE)) {
        const accountsStore = db.createObjectStore(ACCOUNTS_STORE, { keyPath: 'id' });
      }
      
      // Savings Goals store
      if (!db.objectStoreNames.contains(SAVINGS_GOALS_STORE)) {
        const savingsGoalsStore = db.createObjectStore(SAVINGS_GOALS_STORE, { keyPath: 'id' });
        savingsGoalsStore.createIndex('name', 'name', { unique: false });
        savingsGoalsStore.createIndex('dueDate', 'dueDate', { unique: false });
      }
      
      // Life Goals store
      if (!db.objectStoreNames.contains(LIFE_GOALS_STORE)) {
        const lifeGoalsStore = db.createObjectStore(LIFE_GOALS_STORE, { keyPath: 'id' });
        lifeGoalsStore.createIndex('title', 'title', { unique: false });
        lifeGoalsStore.createIndex('category', 'category', { unique: false });
        lifeGoalsStore.createIndex('isCompleted', 'isCompleted', { unique: false });
      }
      
      // Wishlist store - NEW
      if (!db.objectStoreNames.contains(WISHLIST_STORE)) {
        const wishlistStore = db.createObjectStore(WISHLIST_STORE, { keyPath: 'id' });
        wishlistStore.createIndex('itemName', 'itemName', { unique: false });
        wishlistStore.createIndex('category', 'category', { unique: false });
        wishlistStore.createIndex('priority', 'priority', { unique: false });
        wishlistStore.createIndex('dateAdded', 'dateAdded', { unique: false });
        wishlistStore.createIndex('targetDate', 'targetDate', { unique: false });
      }
    };
  });
};

// Enhanced error handling wrapper
const executeDBOperation = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new Error(`Database error: ${error.message}`);
  }
};

// ======================
// SUBSCRIPTIONS FUNCTIONS
// ======================

export const getSubscriptions = async () => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readonly');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
};

export const saveSubscriptions = async (subscriptions) => {
  return executeDBOperation(async () => {
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
  });
};

export const addSubscription = async (subscription) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(subscription);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const updateSubscription = async (subscription) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(subscription);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const deleteSubscription = async (id) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SUBSCRIPTIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SUBSCRIPTIONS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// EXPENSES FUNCTIONS
// ======================

export const getExpenses = async () => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readonly');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
};

export const addExpense = async (expense) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(expense);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const updateExpense = async (expense) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(expense);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const deleteExpense = async (id) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([EXPENSES_STORE], 'readwrite');
    const store = transaction.objectStore(EXPENSES_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// BNPL FUNCTIONS - FIXED FIELD NAMES
// ======================

export const getBNPLItems = async () => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readonly');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
};

export const addBNPLItem = async (bnplItem) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readwrite');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(bnplItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const updateBNPLItem = async (bnplItem) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readwrite');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(bnplItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const deleteBNPLItem = async (id) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([BNPL_STORE], 'readwrite');
    const store = transaction.objectStore(BNPL_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// ACCOUNTS FUNCTIONS
// ======================

export const getAccounts = async () => {
  return executeDBOperation(async () => {
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
  });
};

export const updateAccounts = async (accounts) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([ACCOUNTS_STORE], 'readwrite');
    const store = transaction.objectStore(ACCOUNTS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put({ id: 'accounts', data: accounts });
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// SAVINGS GOALS FUNCTIONS
// ======================

export const getSavingsGoals = async () => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SAVINGS_GOALS_STORE], 'readonly');
    const store = transaction.objectStore(SAVINGS_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
};

export const addSavingsGoal = async (savingsGoal) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SAVINGS_GOALS_STORE], 'readwrite');
    const store = transaction.objectStore(SAVINGS_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(savingsGoal);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const updateSavingsGoal = async (savingsGoal) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SAVINGS_GOALS_STORE], 'readwrite');
    const store = transaction.objectStore(SAVINGS_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(savingsGoal);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const deleteSavingsGoal = async (id) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([SAVINGS_GOALS_STORE], 'readwrite');
    const store = transaction.objectStore(SAVINGS_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// LIFE GOALS FUNCTIONS
// ======================

export const getLifeGoals = async () => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([LIFE_GOALS_STORE], 'readonly');
    const store = transaction.objectStore(LIFE_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
};

export const addLifeGoal = async (lifeGoal) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([LIFE_GOALS_STORE], 'readwrite');
    const store = transaction.objectStore(LIFE_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(lifeGoal);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const updateLifeGoal = async (lifeGoal) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([LIFE_GOALS_STORE], 'readwrite');
    const store = transaction.objectStore(LIFE_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(lifeGoal);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const deleteLifeGoal = async (id) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([LIFE_GOALS_STORE], 'readwrite');
    const store = transaction.objectStore(LIFE_GOALS_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// WISHLIST FUNCTIONS - NEW
// ======================

export const getWishlistItems = async () => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([WISHLIST_STORE], 'readonly');
    const store = transaction.objectStore(WISHLIST_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  });
};

export const addWishlistItem = async (wishlistItem) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([WISHLIST_STORE], 'readwrite');
    const store = transaction.objectStore(WISHLIST_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.add(wishlistItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const updateWishlistItem = async (wishlistItem) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([WISHLIST_STORE], 'readwrite');
    const store = transaction.objectStore(WISHLIST_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.put(wishlistItem);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  });
};

export const deleteWishlistItem = async (id) => {
  return executeDBOperation(async () => {
    const db = await openDB();
    const transaction = db.transaction([WISHLIST_STORE], 'readwrite');
    const store = transaction.objectStore(WISHLIST_STORE);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  });
};

// ======================
// UTILITY FUNCTIONS
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
  const numAmount = parseFloat(amount);
  return `RM${numAmount.toLocaleString('en-MY', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const formatCurrencyWhole = (amount) => {
  const numAmount = Math.round(parseFloat(amount));
  return `RM${numAmount.toLocaleString('en-MY')}`;
};

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
      daysUntil: getDaysUntil(item.nextPayment || item.nextDue || item.nextPaymentDate)
    }))
    .filter(item => item.daysUntil <= daysThreshold && item.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
};

// Helper function to get priority color
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-100';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100';
    case 'low':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

// Helper function to get priority text
export const getPriorityText = (priority) => {
  switch (priority) {
    case 'high':
      return 'High Priority';
    case 'medium':
      return 'Medium Priority';
    case 'low':
      return 'Low Priority';
    default:
      return 'No Priority';
  }
};