// hooks/useSubscriptions.js
import { useState } from 'react';
import { 
  getSubscriptions, 
  addSubscription as addSubscriptionToDB, 
  updateSubscription as updateSubscriptionInDB,
  deleteSubscription as deleteSubscriptionFromDB
} from '../utils/storage';

export const useSubscriptions = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    currentCost: '',
    regularCost: '',
    billingCycle: 'monthly',
    nextPayment: '',
    category: 'entertainment',
    isPromo: false,
    promoEndDate: ''
  });

  const loadData = async () => {
    try {
      const subscriptions = await getSubscriptions();
      setData(subscriptions);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const add = async (subscriptionData) => {
    const dataToUse = subscriptionData || formData;
    
    if (dataToUse.name && (dataToUse.currentCost || dataToUse.currentCost === '0') && dataToUse.nextPayment) {
      try {
        const subscription = {
          ...dataToUse,
          id: Date.now(),
          cost: parseFloat(dataToUse.currentCost) || 0,
          currentCost: parseFloat(dataToUse.currentCost) || 0,
          regularCost: dataToUse.regularCost ? parseFloat(dataToUse.regularCost) : null,
          promoEndDate: dataToUse.isPromo ? dataToUse.nextPayment : dataToUse.promoEndDate,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addSubscriptionToDB(subscription);
        setData(prev => [...prev, subscription]);
        resetForm();
        setShowModal(false);
      } catch (error) {
        console.error('Error adding subscription:', error);
        alert('Error adding subscription: ' + error.message);
      }
    }
  };

  const update = async (subscriptionData) => {
    const dataToUse = subscriptionData || formData;
    
    if (dataToUse.name && (dataToUse.currentCost || dataToUse.currentCost === '0') && dataToUse.nextPayment && editing) {
      try {
        const updatedSubscription = {
          ...editing,
          ...dataToUse,
          cost: parseFloat(dataToUse.currentCost) || 0,
          currentCost: parseFloat(dataToUse.currentCost) || 0,
          regularCost: dataToUse.regularCost ? parseFloat(dataToUse.regularCost) : null,
          promoEndDate: dataToUse.isPromo ? dataToUse.nextPayment : dataToUse.promoEndDate,
        };
        
        await updateSubscriptionInDB(updatedSubscription);
        setData(prev => prev.map(sub => 
          sub.id === editing.id ? updatedSubscription : sub
        ));
        
        resetForm();
        setEditing(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    }
  };

  const remove = async (id) => {
    try {
      await deleteSubscriptionFromDB(id);
      setData(prev => prev.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const confirmDelete = async () => {
    if (toDelete) {
      await remove(toDelete.id);
      setShowDeleteModal(false);
      setToDelete(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      currentCost: '',
      regularCost: '',
      billingCycle: 'monthly',
      nextPayment: '',
      category: 'entertainment',
      isPromo: false,
      promoEndDate: ''
    });
  };

  return {
    data,
    showModal,
    setShowModal,
    showDeleteModal,
    setShowDeleteModal,
    editing,
    setEditing,
    toDelete,
    setToDelete,
    formData,
    setFormData,
    loadData,
    add,
    update,
    remove,
    confirmDelete,
    resetForm
  };
};