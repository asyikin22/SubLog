import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

export const DeleteSavingsGoalModal = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  savingsGoalToDelete,
  confirmDelete
}) => {
  if (!showDeleteConfirm || !savingsGoalToDelete) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg max-w-xs w-full shadow-lg">
        <div className="p-3 text-center">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Savings Goal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete "{savingsGoalToDelete.name}"? This action cannot be undone.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center space-x-1 text-sm"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DeleteLifeGoalModal = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  lifeGoalToDelete,
  confirmDelete
}) => {
  if (!showDeleteConfirm || !lifeGoalToDelete) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/10 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg max-w-xs w-full shadow-lg">
        <div className="p-3 text-center">
          <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Life Goal</h3>
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete "{lifeGoalToDelete.title}"? This action cannot be undone.
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 py-2 px-3 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center justify-center space-x-1 text-sm"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};