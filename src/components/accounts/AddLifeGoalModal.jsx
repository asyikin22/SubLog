import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const AddLifeGoalModal = ({ 
  showLifeGoalForm, 
  setShowLifeGoalForm,
  newLifeGoal,
  setNewLifeGoal,
  addLifeGoal,
  editingLifeGoal,
  setEditingLifeGoal,
  updateLifeGoal
}) => {
  useEffect(() => {
    if (editingLifeGoal && showLifeGoalForm) {
      setNewLifeGoal({
        title: editingLifeGoal.title,
        category: editingLifeGoal.category,
        dueDate: editingLifeGoal.dueDate || ''
      });
    }
  }, [editingLifeGoal, showLifeGoalForm, setNewLifeGoal]);

  const handleSubmit = () => {
    editingLifeGoal ? updateLifeGoal() : addLifeGoal();
  };

  const resetForm = () => {
    setNewLifeGoal({ title: '', category: 'personal', dueDate: '' });
    setEditingLifeGoal(null);
  };

  const handleClose = () => {
    setShowLifeGoalForm(false);
    resetForm();
  };

  const categories = [
    { value: 'health', label: 'Health & Fitness' },
    { value: 'career', label: 'Career & Education' },
    { value: 'personal', label: 'Personal Development' },
    { value: 'relationships', label: 'Relationships' },
    { value: 'hobbies', label: 'Hobbies & Interests' },
    { value: 'travel', label: 'Travel & Adventure' }
  ];

  if (!showLifeGoalForm) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg max-w-xs w-full shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingLifeGoal ? 'Edit Life Goal' : 'Add Life Goal'}
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
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-1">Goal Title *</label>
            <input
              type="text"
              value={newLifeGoal.title}
              onChange={(e) => setNewLifeGoal({ ...newLifeGoal, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., Run a marathon"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 mb-1">Category *</label>
            <select
              value={newLifeGoal.category}
              onChange={(e) => setNewLifeGoal({ ...newLifeGoal, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 mb-1">Target Date</label>
            <input
              type="date"
              value={newLifeGoal.dueDate}
              onChange={(e) => setNewLifeGoal({ ...newLifeGoal, dueDate: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

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
              disabled={!newLifeGoal.title.trim()}
              className="flex-1 py-2 px-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
            >
              {editingLifeGoal ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLifeGoalModal;
