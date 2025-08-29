// components/layout/FloatingAddButton.jsx
import React from 'react';
import { Plus } from 'lucide-react';

const FloatingAddButton = ({ currentPage, subscriptions, expenses, bnpl, goals, wishlist }) => {
  const getAddButtonAction = () => {
    switch (currentPage) {
      case 'expenses': 
        return () => expenses.setShowModal(true);
      case 'subscriptions': 
        return () => subscriptions.setShowModal(true);
      case 'bnpl': 
        return () => bnpl.setShowModal(true);
      case 'wishlist':
        return () => wishlist.setShowModal(true);
      case 'accounts': 
        return () => goals.setShowSavingsGoalModal(true);
      case 'dashboard': 
        return () => subscriptions.setShowModal(true); // Default to subscription on dashboard
      default: 
        return () => subscriptions.setShowModal(true);
    }
  };

  const getButtonColor = () => {
    switch (currentPage) {
      case 'wishlist':
        return 'bg-pink-500/50 hover:bg-pink-600/60 hover:border-pink-200/20';
      default:
        return 'bg-blue-500/50 hover:bg-blue-600/60 hover:border-white/20';
    }
  };

  // Don't show if any modal is open or if on dashboard
  const shouldShowButton = currentPage !== 'dashboard' &&
    !subscriptions.showModal &&
    !expenses.showModal &&
    !bnpl.showModal &&
    !goals.showSavingsGoalModal &&
    !goals.showLifeGoalModal &&
    !(wishlist && wishlist.showModal);

  if (!shouldShowButton) {
    return null;
  }

  return (
    <button
      onClick={getAddButtonAction()}
      className={`fixed bottom-20 right-6 ${getButtonColor()} backdrop-blur-md text-white w-12 h-12 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-105 border border-white/10`}
    >
      <Plus size={28} />
    </button>
  );
};

export default FloatingAddButton;