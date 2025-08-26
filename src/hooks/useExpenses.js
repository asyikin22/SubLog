// hooks/useExpenses.js
import { useState } from 'react';
import { 
  getExpenses, 
  addExpense as addExpenseToDB, 
  updateExpense as updateExpenseInDB,
  deleteExpense as deleteExpenseFromDB
} from '../utils/storage';

export const useExpenses = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category: 'housing',
    nextDue: '',
    description: ''
  });

  const loadData = async () => {
    try {
      const expenses = await getExpenses();
      setData(expenses);
    } catch (error) {
      console.error('Error loading expenses:', error);
    }
  };

  const add = async (expenseData) => {
    const dataToUse = expenseData || formData;
    
    if (dataToUse.name && dataToUse.amount && dataToUse.nextDue) {
      try {
        const expense = {
          ...dataToUse,
          id: Date.now(),
          amount: parseFloat(dataToUse.amount) || 0,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addExpenseToDB(expense);
        setData(prev => [...prev, expense]);
        resetForm();
        setShowModal(false);
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Error adding expense: ' + error.message);
      }
    }
  };

  const update = async (expenseData) => {
    const dataToUse = expenseData || formData;
    
    if (dataToUse.name && dataToUse.amount && dataToUse.nextDue && editing) {
      try {
        const updatedExpense = {
          ...editing,
          ...dataToUse,
          amount: parseFloat(dataToUse.amount) || 0
        };
        
        await updateExpenseInDB(updatedExpense);
        setData(prev => prev.map(exp => 
          exp.id === editing.id ? updatedExpense : exp
        ));
        
        resetForm();
        setEditing(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    }
  };

  const remove = async (id) => {
    try {
      await deleteExpenseFromDB(id);
      setData(prev => prev.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
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
      amount: '',
      category: 'housing',
      nextDue: '',
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