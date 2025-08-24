import { useEffect } from 'react';

const AddExpenseModal = ({ 
  showExpenseForm, 
  setShowExpenseForm, 
  newExpense, 
  setNewExpense, 
  addExpense,
  editingExpense,
  setEditingExpense,
  updateExpense
}) => {
  // Populate form when editing
  useEffect(() => {
    if (editingExpense) {
      setNewExpense({
        name: editingExpense.name || '',
        amount: editingExpense.amount?.toString() || '',
        category: editingExpense.category || 'housing',
        nextDue: editingExpense.nextDue || '',
        description: editingExpense.description || ''
      });
    }
  }, [editingExpense, setNewExpense]);

  if (!showExpenseForm) return null;

  const handleSubmit = () => {
    console.log('Submit clicked!');
    console.log('Form data:', newExpense);
    
    // Validate required fields
    if (!newExpense.name) {
      alert('Please enter an expense name');
      return;
    }
    
    if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!newExpense.nextDue) {
      alert('Please enter the next due date');
      return;
    }
    
    const expenseData = {
      ...newExpense,
      amount: parseFloat(newExpense.amount) || 0
    };
    
    console.log('Expense data to save:', expenseData);
    
    try {
      if (editingExpense) {
        console.log('Updating expense...');
        updateExpense(expenseData);
      } else {
        console.log('Adding new expense...');
        addExpense(expenseData);
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      alert('Error saving expense: ' + error.message);
    }
  };

  const handleClose = () => {
    if (editingExpense) {
      setEditingExpense(null);
    }
    setShowExpenseForm(false);
    
    setTimeout(() => {
      setNewExpense({
        name: '',
        amount: '',
        category: 'housing',
        nextDue: '',
        description: ''
      });
    }, 50);
  };

  const isEditing = !!editingExpense;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 z-50 flex items-center justify-center p-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl w-full md:max-w-lg max-h-[500px] overflow-y-auto">
        <div className="p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Expense' : 'Add New Expense'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3 pr-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expense Name</label>
                <input
                  type="text"
                  value={newExpense.name || ''}
                  onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Rent, Car Payment, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Amount (MYR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="1500.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newExpense.category || 'housing'}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="housing">Housing</option>
                    <option value="transport">Transport</option>
                    <option value="utilities">Utilities</option>
                    <option value="phone">Phone</option>
                    <option value="internet">Internet</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Due Date
                </label>
                <input
                  type="date"
                  value={newExpense.nextDue || ''}
                  onChange={(e) => setNewExpense({...newExpense, nextDue: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={newExpense.description || ''}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Additional notes..."
                  rows="2"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-5 flex-shrink-0">
            <button
              onClick={handleSubmit}
              className="flex-1 text-sm bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 text-sm bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;