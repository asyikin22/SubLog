import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { formatCurrency } from '../../utils/storage';

const AddSavingsGoalModal = ({ 
  showSavingsGoalForm, 
  setShowSavingsGoalForm,
  newSavingsGoal,
  setNewSavingsGoal,
  addSavingsGoal,
  editingSavingsGoal,
  setEditingSavingsGoal,
  updateSavingsGoal
}) => {
  useEffect(() => {
    if (editingSavingsGoal && showSavingsGoalForm) {
      setNewSavingsGoal({
        name: editingSavingsGoal.name,
        targetAmount: editingSavingsGoal.targetAmount.toString(),
        currentAmount: editingSavingsGoal.currentAmount.toString(),
        dueDate: editingSavingsGoal.dueDate,
        description: editingSavingsGoal.description || ''
      });
    }
  }, [editingSavingsGoal, showSavingsGoalForm, setNewSavingsGoal]);

  const handleSubmit = () => {
    if (editingSavingsGoal) {
      updateSavingsGoal();
    } else {
      addSavingsGoal();
    }
  };

  const resetForm = () => {
    setNewSavingsGoal({
      name: '',
      targetAmount: '',
      currentAmount: '0',
      dueDate: '',
      description: ''
    });
    setEditingSavingsGoal(null);
  };

  const handleClose = () => {
    setShowSavingsGoalForm(false);
    resetForm();
  };

  const getMonthlyAmountNeeded = () => {
    const target = parseFloat(newSavingsGoal.targetAmount) || 0;
    const current = parseFloat(newSavingsGoal.currentAmount) || 0;
    const remaining = target - current;
    
    if (remaining <= 0 || !newSavingsGoal.dueDate) return 0;
    
    const today = new Date();
    const dueDate = new Date(newSavingsGoal.dueDate);
    const monthsLeft = (dueDate.getFullYear() - today.getFullYear()) * 12 + (dueDate.getMonth() - today.getMonth());
    
    if (monthsLeft <= 0) return remaining;
    
    return remaining / monthsLeft;
  };

  if (!showSavingsGoalForm) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg max-w-xs w-full shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingSavingsGoal ? 'Edit Savings Goal' : 'Add Savings Goal'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-3 space-y-3 text-sm">
          {/* Goal Name */}
          <div>
            <label className="block text-gray-700 mb-1">Goal Name *</label>
            <input
              type="text"
              value={newSavingsGoal.name}
              onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, name: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Emergency Fund, Vacation, New Car"
              required
            />
          </div>
          
          {/* Target and Current Amount */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-gray-700 mb-1">Target Amount *</label>
              <input
                type="number"
                step="0.01"
                value={newSavingsGoal.targetAmount}
                onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, targetAmount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                placeholder="10000"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1">Current Amount</label>
              <input
                type="number"
                step="0.01"
                value={newSavingsGoal.currentAmount}
                onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, currentAmount: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                placeholder="0"
              />
            </div>
          </div>
          
          {/* Target Date */}
          <div>
            <label className="block text-gray-700 mb-1">Target Date *</label>
            <input
              type="date"
              value={newSavingsGoal.dueDate}
              onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              value={newSavingsGoal.description}
              onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
              placeholder="Why is this goal important to you?"
              rows="3"
            />
          </div>
          
          {/* Monthly Savings Calculation */}
          {newSavingsGoal.targetAmount && newSavingsGoal.dueDate && (
            <div className="bg-green-50 border border-green-200 rounded-md p-2">
              <h4 className="font-medium text-green-800 mb-1 text-sm">Monthly Savings Needed</h4>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(getMonthlyAmountNeeded())}
              </p>
              <p className="text-xs text-green-600 mt-1">
                To reach your goal by {new Date(newSavingsGoal.dueDate).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!newSavingsGoal.name.trim() || !newSavingsGoal.targetAmount || !newSavingsGoal.dueDate}
              className="flex-1 py-2 px-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              {editingSavingsGoal ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSavingsGoalModal;