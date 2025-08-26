// hooks/useGoals.js
import { useState } from 'react';
import { 
  getSavingsGoals, 
  addSavingsGoal as addSavingsGoalToDB, 
  updateSavingsGoal as updateSavingsGoalInDB,
  deleteSavingsGoal as deleteSavingsGoalFromDB,
  getLifeGoals,
  addLifeGoal as addLifeGoalToDB,
  updateLifeGoal as updateLifeGoalInDB,
  deleteLifeGoal as deleteLifeGoalFromDB
} from '../utils/storage';

export const useGoals = () => {
  // Savings Goals State
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState(false);
  const [showDeleteSavingsGoalModal, setShowDeleteSavingsGoalModal] = useState(false);
  const [editingSavingsGoal, setEditingSavingsGoal] = useState(null);
  const [savingsGoalToDelete, setSavingsGoalToDelete] = useState(null);
  const [savingsGoalFormData, setSavingsGoalFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '0',
    dueDate: '',
    description: ''
  });

  // Life Goals State
  const [lifeGoals, setLifeGoals] = useState([]);
  const [showLifeGoalModal, setShowLifeGoalModal] = useState(false);
  const [showDeleteLifeGoalModal, setShowDeleteLifeGoalModal] = useState(false);
  const [editingLifeGoal, setEditingLifeGoal] = useState(null);
  const [lifeGoalToDelete, setLifeGoalToDelete] = useState(null);
  const [lifeGoalFormData, setLifeGoalFormData] = useState({
    title: '',
    description: '',
    category: 'personal',
    dueDate: '',
    progress: 0,
    isCompleted: false
  });

  // Load Data Functions
  const loadData = async () => {
    try {
      const [savedSavingsGoals, savedLifeGoals] = await Promise.all([
        getSavingsGoals(),
        getLifeGoals()
      ]);
      
      setSavingsGoals(savedSavingsGoals);
      setLifeGoals(savedLifeGoals);
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  // ======================
  // SAVINGS GOALS FUNCTIONS
  // ======================
  const addSavingsGoal = async (savingsGoalData) => {
    const dataToUse = savingsGoalData || savingsGoalFormData;
    
    if (dataToUse.name && dataToUse.targetAmount && dataToUse.dueDate) {
      try {
        const savingsGoal = {
          ...dataToUse,
          id: Date.now(),
          targetAmount: parseFloat(dataToUse.targetAmount) || 0,
          currentAmount: parseFloat(dataToUse.currentAmount) || 0,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addSavingsGoalToDB(savingsGoal);
        setSavingsGoals(prev => [...prev, savingsGoal]);
        resetSavingsGoalForm();
        setShowSavingsGoalModal(false);
      } catch (error) {
        console.error('Error adding savings goal:', error);
        alert('Error adding savings goal: ' + error.message);
      }
    }
  };

  const updateSavingsGoal = async (savingsGoalData) => {
    const dataToUse = savingsGoalData || savingsGoalFormData;
    
    if (dataToUse.name && dataToUse.targetAmount && dataToUse.dueDate && editingSavingsGoal) {
      try {
        const updatedSavingsGoal = {
          ...editingSavingsGoal,
          ...dataToUse,
          targetAmount: parseFloat(dataToUse.targetAmount) || 0,
          currentAmount: parseFloat(dataToUse.currentAmount) || 0
        };
        
        await updateSavingsGoalInDB(updatedSavingsGoal);
        setSavingsGoals(prev => prev.map(goal => 
          goal.id === editingSavingsGoal.id ? updatedSavingsGoal : goal
        ));
        
        resetSavingsGoalForm();
        setEditingSavingsGoal(null);
        setShowSavingsGoalModal(false);
      } catch (error) {
        console.error('Error updating savings goal:', error);
      }
    }
  };

  const deleteSavingsGoal = async (id) => {
    try {
      await deleteSavingsGoalFromDB(id);
      setSavingsGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting savings goal:', error);
    }
  };

  const confirmDeleteSavingsGoal = async () => {
    if (savingsGoalToDelete) {
      await deleteSavingsGoal(savingsGoalToDelete.id);
      setShowDeleteSavingsGoalModal(false);
      setSavingsGoalToDelete(null);
    }
  };

  const resetSavingsGoalForm = () => {
    setSavingsGoalFormData({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      dueDate: '',
      description: ''
    });
  };

  // ======================
  // LIFE GOALS FUNCTIONS
  // ======================
  const addLifeGoal = async (lifeGoalData) => {
    const dataToUse = lifeGoalData || lifeGoalFormData;
    
    if (dataToUse.title && dataToUse.category) {
      try {
        const lifeGoal = {
          ...dataToUse,
          id: Date.now(),
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addLifeGoalToDB(lifeGoal);
        setLifeGoals(prev => [...prev, lifeGoal]);
        resetLifeGoalForm();
        setShowLifeGoalModal(false);
      } catch (error) {
        console.error('Error adding life goal:', error);
        alert('Error adding life goal: ' + error.message);
      }
    }
  };

  const updateLifeGoal = async (lifeGoalData) => {
    const dataToUse = lifeGoalData || lifeGoalFormData;
    
    if (dataToUse.title && dataToUse.category && editingLifeGoal) {
      try {
        const updatedLifeGoal = {
          ...editingLifeGoal,
          ...dataToUse
        };
        
        await updateLifeGoalInDB(updatedLifeGoal);
        setLifeGoals(prev => prev.map(goal => 
          goal.id === editingLifeGoal.id ? updatedLifeGoal : goal
        ));
        
        resetLifeGoalForm();
        setEditingLifeGoal(null);
        setShowLifeGoalModal(false);
      } catch (error) {
        console.error('Error updating life goal:', error);
      }
    }
  };

  const deleteLifeGoal = async (id) => {
    try {
      await deleteLifeGoalFromDB(id);
      setLifeGoals(prev => prev.filter(goal => goal.id !== id));
    } catch (error) {
      console.error('Error deleting life goal:', error);
    }
  };

  const confirmDeleteLifeGoal = async () => {
    if (lifeGoalToDelete) {
      await deleteLifeGoal(lifeGoalToDelete.id);
      setShowDeleteLifeGoalModal(false);
      setLifeGoalToDelete(null);
    }
  };

  const resetLifeGoalForm = () => {
    setLifeGoalFormData({
      title: '',
      description: '',
      category: 'personal',
      dueDate: '',
      progress: 0,
      isCompleted: false
    });
  };

  // ======================
  // UTILITY FUNCTIONS
  // ======================
  const getSavingsGoalProgress = (goal) => {
    if (!goal.targetAmount || goal.targetAmount === 0) return 0;
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  };

  const getLifeGoalsByCategory = (category) => {
    return lifeGoals.filter(goal => goal.category === category);
  };

  const getCompletedLifeGoals = () => {
    return lifeGoals.filter(goal => goal.isCompleted);
  };

  const getPendingLifeGoals = () => {
    return lifeGoals.filter(goal => !goal.isCompleted);
  };

  return {
    // Savings Goals
    savingsGoals,
    setSavingsGoals,
    showSavingsGoalModal,
    setShowSavingsGoalModal,
    showDeleteSavingsGoalModal,
    setShowDeleteSavingsGoalModal,
    editingSavingsGoal,
    setEditingSavingsGoal,
    savingsGoalToDelete,
    setSavingsGoalToDelete,
    savingsGoalFormData,
    setSavingsGoalFormData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    confirmDeleteSavingsGoal,
    resetSavingsGoalForm,
    getSavingsGoalProgress,

    // Life Goals
    lifeGoals,
    setLifeGoals,
    showLifeGoalModal,
    setShowLifeGoalModal,
    showDeleteLifeGoalModal,
    setShowDeleteLifeGoalModal,
    editingLifeGoal,
    setEditingLifeGoal,
    lifeGoalToDelete,
    setLifeGoalToDelete,
    lifeGoalFormData,
    setLifeGoalFormData,
    addLifeGoal,
    updateLifeGoal,
    deleteLifeGoal,
    confirmDeleteLifeGoal,
    resetLifeGoalForm,
    getLifeGoalsByCategory,
    getCompletedLifeGoals,
    getPendingLifeGoals,

    // Common
    loadData
  };
};