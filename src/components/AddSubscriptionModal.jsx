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
        name: editingSubscription.name || '',
        currentCost: editingSubscription.currentCost?.toString() || editingSubscription.cost?.toString() || '',
        regularCost: editingSubscription.regularCost?.toString() || editingSubscription.cost?.toString() || '',
        billingCycle: editingSubscription.billingCycle || 'monthly',
        nextPayment: editingSubscription.nextPayment || '',
        category: editingSubscription.category || 'entertainment',
        isPromo: editingSubscription.isPromo || false,
        promoEndDate: editingSubscription.promoEndDate || ''
      });
    }
  }, [editingSubscription, setNewSubscription]);

  if (!showAddForm) return null;

  const handleSubmit = () => {
    console.log('Submit clicked!');
    console.log('Form data:', newSubscription);
    
    // Validate required fields
    if (!newSubscription.name) {
      alert('Please enter a service name');
      return;
    }
    
    if (!newSubscription.currentCost && newSubscription.currentCost !== '0') {
      alert('Please enter the current cost (use 0 for free trials)');
      return;
    }
    
    // Simple logic: use currentCost as the main cost
    const subscriptionData = {
      ...newSubscription,
      cost: parseFloat(newSubscription.currentCost) || 0
    };
    
    console.log('Subscription data to save:', subscriptionData);
    
    try {
      if (editingSubscription) {
        console.log('Updating subscription...');
        updateSubscription(subscriptionData);
      } else {
        console.log('Adding new subscription...');
        addSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
      alert('Error saving subscription: ' + error.message);
    }
  };

  const handleClose = () => {
    if (editingSubscription) {
      setEditingSubscription(null);
    }
    setShowAddForm(false);
    
    setTimeout(() => {
      setNewSubscription({
        name: '',
        currentCost: '',
        regularCost: '',
        billingCycle: 'monthly',
        nextPayment: '',
        category: 'entertainment',
        isPromo: false,
        promoEndDate: ''
      });
    }, 50);
  };

  const isEditing = !!editingSubscription;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 z-50 flex items-center justify-center p-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl w-full md:max-w-lg max-h-[500px] overflow-y-auto">
        <div className="p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
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
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3 pr-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={newSubscription.name || ''}
                  onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Netflix, Spotify, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Cost (MYR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSubscription.currentCost || ''}
                    onChange={(e) => setNewSubscription({...newSubscription, currentCost: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0 for free trial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Billing</label>
                  <select
                    value={newSubscription.billingCycle || 'monthly'}
                    onChange={(e) => setNewSubscription({...newSubscription, billingCycle: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              {/* Simple promo checkbox */}
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="isPromo"
                  checked={newSubscription.isPromo || false}
                  onChange={(e) => setNewSubscription({...newSubscription, isPromo: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPromo" className="text-sm font-medium text-gray-700">
                  This is a promotional price (trial/discount)
                </label>
              </div>

              {/* Always show these fields, but conditionally style them */}
              <div className={`p-2 rounded-lg border transition-all duration-200 ${
                newSubscription.isPromo 
                  ? 'bg-blue-50 border-blue-200 opacity-100' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price After Promo (MYR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSubscription.regularCost || ''}
                    onChange={(e) => setNewSubscription({...newSubscription, regularCost: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="17.99"
                    disabled={!newSubscription.isPromo}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newSubscription.category || 'entertainment'}
                    onChange={(e) => setNewSubscription({...newSubscription, category: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Charge Date
                  </label>
                  <input
                    type="date"
                    value={newSubscription.nextPayment || ''}
                    onChange={(e) => setNewSubscription({...newSubscription, nextPayment: e.target.value})}
                    className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-5 flex-shrink-0">
            <button
              onClick={handleSubmit}
              className="flex-1 text-sm bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
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

export default AddSubscriptionModal;