import { Trash2, AlertTriangle } from 'lucide-react';

const DeleteExpenseModal = ({
  showDeleteConfirm,
  setShowDeleteConfirm,
  expenseToDelete,
  confirmDelete
}) => {
  if (!showDeleteConfirm || !expenseToDelete) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 z-50 flex items-center justify-center p-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl w-full md:max-w-md">
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Expense?</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <strong>{expenseToDelete.name}</strong>? 
            This action cannot be undone.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-1"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteExpenseModal;