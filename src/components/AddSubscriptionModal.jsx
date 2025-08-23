import { useEffect } from 'react';

const AddSubscriptionModal = ({ 
  showAddForm, 
  setShowAddForm, 
  newSubscription, 
  setNewSubscription, 
  addSubscription,
  editingSubscription,
  setEditingSubscription,
  updateSubscription
}) => {
  // Populate form when editing
  useEffect(() => {
    if (editingSubscription) {
      setNewSubscription({
        name: editingSubscription.name,
        cost: editingSubscription.cost.toString(),
        billingCycle: editingSubscription.billingCycle,
        nextPayment: editingSubscription.nextPayment,
        category: editingSubscription.category
      });
    }
  }, [editingSubscription, setNewSubscription]);

  if (!showAddForm) return null;

  const handleSubmit = () => {
    if (editingSubscription) {
      updateSubscription();
    } else {
      addSubscription();
    }
  };

  const handleClose = () => {
    if (editingSubscription) {
      setEditingSubscription(null);
    }
    setShowAddForm(false);
    
    // Reset form only after a small delay to prevent flash
    setTimeout(() => {
      setNewSubscription({
        name: '',
        cost: '',
        billingCycle: 'monthly',
        nextPayment: '',
        category: 'entertainment'
      });
    }, 50);
  };

  const isEditing = !!editingSubscription;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 z-50 flex items-center justify-center p-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Subscription' : 'Add New Subscription'}
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
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
              <input
                type="text"
                value={newSubscription.name}
                onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                className="w-full text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Netflix, Spotify, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cost (MYR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newSubscription.cost}
                  onChange={(e) => setNewSubscription({...newSubscription, cost: e.target.value})}
                  className="w-full text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="9.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Billing</label>
                <select
                  value={newSubscription.billingCycle}
                  onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value})}
                  className="w-full text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newSubscription.category}
                  onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                  className="w-full text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="entertainment">Entertainment</option>
                  <option value="productivity">Productivity</option>
                  <option value="fitness">Fitness</option>
                  <option value="music">Music</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Next Payment Date</label>
                <input
                  type="date"
                  value={newSubscription.nextPayment}
                  onChange={(e) => setNewSubscription({...newSubscription, nextPayment: e.target.value})}
                  className="w-full text-sm px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 text-sm bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 text-sm bg-gray-200 text-gray-800 py-1 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;