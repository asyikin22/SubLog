// hooks/useBNPL.js
import { useState } from 'react';
import { 
  getBNPLItems, 
  addBNPLItem as addBNPLItemToDB, 
  updateBNPLItem as updateBNPLItemInDB,
  deleteBNPLItem as deleteBNPLItemFromDB
} from '../utils/storage';

export const useBNPL = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    totalAmount: '',
    platform: 'grab',
    nextPaymentDate: '',
    description: ''
  });

  const loadData = async () => {
    try {
      const bnplItems = await getBNPLItems();
      setData(bnplItems);
    } catch (error) {
      console.error('Error loading BNPL items:', error);
    }
  };

  const add = async (bnplData) => {
    const dataToUse = bnplData || formData;
    
    if (dataToUse.itemName && dataToUse.totalAmount && dataToUse.nextPaymentDate) {
      try {
        const bnplItem = {
          ...dataToUse,
          id: Date.now(),
          totalAmount: parseFloat(dataToUse.totalAmount) || 0,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addBNPLItemToDB(bnplItem);
        setData(prev => [...prev, bnplItem]);
        resetForm();
        setShowModal(false);
      } catch (error) {
        console.error('Error adding BNPL item:', error);
        alert('Error adding BNPL item: ' + error.message);
      }
    }
  };

  const update = async (bnplData) => {
    const dataToUse = bnplData || formData;
    
    if (dataToUse.itemName && dataToUse.totalAmount && dataToUse.nextPaymentDate && editing) {
      try {
        const updatedBNPL = {
          ...editing,
          ...dataToUse,
          totalAmount: parseFloat(dataToUse.totalAmount) || 0
        };
        
        await updateBNPLItemInDB(updatedBNPL);
        setData(prev => prev.map(item => 
          item.id === editing.id ? updatedBNPL : item
        ));
        
        resetForm();
        setEditing(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating BNPL item:', error);
      }
    }
  };

  const remove = async (id) => {
    try {
      await deleteBNPLItemFromDB(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting BNPL item:', error);
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
      itemName: '',
      totalAmount: '',
      platform: 'grab',
      nextPaymentDate: '',
      description: ''
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