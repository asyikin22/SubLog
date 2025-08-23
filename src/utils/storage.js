// IndexedDB storage utility for SubLog
const DB_NAME = 'SubLogDB';
const DB_VERSION = 1;
const STORE_NAME = 'subscriptions';

// Open IndexedDB connection
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('category', 'category', { unique: false });
      }
    };
  });
};

// Get all subscriptions
export const getSubscriptions = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
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

// Save all subscriptions
export const saveSubscriptions = async (subscriptions) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Clear existing data
    await new Promise((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onsuccess = () => resolve();
      clearRequest.onerror = () => reject(clearRequest.error);
    });
    
    // Add all subscriptions
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

// Add single subscription
export const addSubscription = async (subscription) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
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

// Update subscription
export const updateSubscription = async (subscription) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.put(subscription); // Use put instead of add for updates
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Delete subscription
export const deleteSubscription = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
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

// Format date to "DD Month YYYY"
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

// Format currency to MYR
export const formatCurrency = (amount) => {
  return `RM${parseFloat(amount).toFixed(2)}`;
};