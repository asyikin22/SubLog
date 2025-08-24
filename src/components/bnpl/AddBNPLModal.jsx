import { useEffect } from 'react';

const AddBNPLModal = ({ 
  showBNPLForm, 
  setShowBNPLForm, 
  newBNPL, 
  setNewBNPL, 
  addBNPL,
  editingBNPL,
  setEditingBNPL,
  updateBNPL
}) => {
  // Populate form when editing
  useEffect(() => {
    if (editingBNPL) {
      setNewBNPL({
        itemName: editingBNPL.itemName || '',
        totalAmount: editingBNPL.totalAmount?.toString() || '',
        platform: editingBNPL.platform || 'grab',
        nextPaymentDate: editingBNPL.nextPaymentDate || '',
        description: editingBNPL.description || ''
      });
    }
  }, [editingBNPL, setNewBNPL]);

  if (!showBNPLForm) return null;

  const handleSubmit = () => {
    console.log('Submit clicked!');
    console.log('Form data:', newBNPL);
    
    // Validate required fields
    if (!newBNPL.itemName) {
      alert('Please enter an item name');
      return;
    }
    
    if (!newBNPL.totalAmount || parseFloat(newBNPL.totalAmount) <= 0) {
      alert('Please enter a valid total amount');
      return;
    }

    if (!newBNPL.nextPaymentDate) {
      alert('Please enter the next payment date');
      return;
    }
    
    const bnplData = {
      ...newBNPL,
      totalAmount: parseFloat(newBNPL.totalAmount) || 0
    };
    
    console.log('BNPL data to save:', bnplData);
    
    try {
      if (editingBNPL) {
        console.log('Updating BNPL...');
        updateBNPL(bnplData);
      } else {
        console.log('Adding new BNPL...');
        addBNPL(bnplData);
      }
    } catch (error) {
      console.error('Error saving BNPL:', error);
      alert('Error saving BNPL: ' + error.message);
    }
  };

  const handleClose = () => {
    if (editingBNPL) {
      setEditingBNPL(null);
    }
    setShowBNPLForm(false);
    
    setTimeout(() => {
      setNewBNPL({
        itemName: '',
        totalAmount: '',
        platform: 'grab',
        nextPaymentDate: '',
        description: ''
      });
    }, 50);
  };

  const isEditing = !!editingBNPL;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 z-50 flex items-center justify-center p-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl w-full md:max-w-lg max-h-[600px] overflow-y-auto">
        <div className="p-3 flex flex-col">
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit BNPL Item' : 'Add New BNPL Item'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={newBNPL.itemName || ''}
                  onChange={(e) => setNewBNPL({...newBNPL, itemName: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="iPhone, Laptop, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount (MYR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newBNPL.totalAmount || ''}
                  onChange={(e) => setNewBNPL({...newBNPL, totalAmount: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3000.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={newBNPL.platform || 'grab'}
                  onChange={(e) => setNewBNPL({...newBNPL, platform: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="grab">Grab</option>
                  <option value="shopee">Shopee</option>
                  <option value="atome">Atome</option>
                  <option value="maybank">Maybank</option>
                  <option value="publicbank">Public Bank</option>
                  <option value="riipay">RiiPay</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Payment Date
                </label>
                <input
                  type="date"
                  value={newBNPL.nextPaymentDate || ''}
                  onChange={(e) => setNewBNPL({...newBNPL, nextPaymentDate: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={newBNPL.description || ''}
                  onChange={(e) => setNewBNPL({...newBNPL, description: e.target.value})}
                  className="w-full text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes..."
                  rows="2"
                />
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

export default AddBNPLModal;