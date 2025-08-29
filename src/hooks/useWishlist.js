// hooks/useWishlist.js
import { useState } from 'react';
import {
  getWishlistItems,
  addWishlistItem as addWishlistItemToDB,
  updateWishlistItem as updateWishlistItemInDB,
  deleteWishlistItem as deleteWishlistItemFromDB
} from '../utils/storage';

export const useWishlist = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    estimatedPrice: '',
    category: '',
    priority: 'medium',
    targetDate: '',
    url: '',
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const wishlistItems = await getWishlistItems();
      setData(wishlistItems);
    } catch (error) {
      console.error('Error loading wishlist items:', error);
    } finally {
      setLoading(false);
    }
  };

  const add = async (wishlistData) => {
    const dataToUse = wishlistData || formData;
    
    if (dataToUse.itemName.trim()) {
      try {
        const wishlistItem = {
          ...dataToUse,
          id: Date.now().toString(),
          estimatedPrice: parseFloat(dataToUse.estimatedPrice) || 0,
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        await addWishlistItemToDB(wishlistItem);
        setData(prev => [...prev, wishlistItem]);
        resetForm();
        setShowModal(false);
      } catch (error) {
        console.error('Error adding wishlist item:', error);
        alert('Error adding wishlist item: ' + error.message);
      }
    }
  };

  const update = async (wishlistData) => {
    const dataToUse = wishlistData || formData;
    
    if (dataToUse.itemName.trim() && editing) {
      try {
        const updatedWishlist = {
          ...editing,
          ...dataToUse,
          estimatedPrice: parseFloat(dataToUse.estimatedPrice) || 0,
          lastUpdated: new Date().toISOString()
        };
        
        await updateWishlistItemInDB(updatedWishlist);
        setData(prev => prev.map(item =>
          item.id === editing.id ? updatedWishlist : item
        ));
        
        resetForm();
        setEditing(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating wishlist item:', error);
        alert('Error updating wishlist item: ' + error.message);
      }
    }
  };

  const remove = async (id) => {
    try {
      await deleteWishlistItemFromDB(id);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting wishlist item:', error);
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
      description: '',
      estimatedPrice: '',
      category: '',
      priority: 'medium',
      targetDate: '',
      url: '',
      notes: ''
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
    loading,
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