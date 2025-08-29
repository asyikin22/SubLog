// components/modals/AddWishlistModal.jsx
import { useEffect } from 'react';
import { X } from 'lucide-react';

const AddWishlistModal = ({
  showWishlistForm,
  setShowWishlistForm,
  newWishlist,
  setNewWishlist,
  addWishlist,
  editingWishlist,
  setEditingWishlist,
  updateWishlist
}) => {
  const categories = [
    'Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 
    'Travel', 'Health & Beauty', 'Automotive', 'Toys & Games', 'Other'
  ];

  const priorities = [
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  // Populate form when editing
  useEffect(() => {
    if (editingWishlist) {
      setNewWishlist({
        itemName: editingWishlist.itemName || '',
        description: editingWishlist.description || '',
        estimatedPrice: editingWishlist.estimatedPrice?.toString() || '',
        category: editingWishlist.category || '',
        priority: editingWishlist.priority || 'medium',
        targetDate: editingWishlist.targetDate ? editingWishlist.targetDate.split('T')[0] : '',
        url: editingWishlist.url || '',
        notes: editingWishlist.notes || ''
      });
    }
  }, [editingWishlist, setNewWishlist]);

  if (!showWishlistForm) return null;

  const handleSubmit = () => {
    console.log('Submit clicked!');
    console.log('Form data:', newWishlist);
    
    // Validate required fields
    if (!newWishlist.itemName.trim()) {
      alert('Please enter an item name');
      return;
    }
    
    const wishlistData = {
      ...newWishlist,
      estimatedPrice: parseFloat(newWishlist.estimatedPrice) || 0
    };
    
    console.log('Wishlist data to save:', wishlistData);
    
    try {
      if (editingWishlist) {
        console.log('Updating wishlist item...');
        updateWishlist(wishlistData);
      } else {
        console.log('Adding new wishlist item...');
        addWishlist(wishlistData);
      }
    } catch (error) {
      console.error('Error saving wishlist item:', error);
      alert('Error saving wishlist item: ' + error.message);
    }
  };

  const handleClose = () => {
    if (editingWishlist) {
      setEditingWishlist(null);
    }
    setShowWishlistForm(false);
    
    setTimeout(() => {
      setNewWishlist({
        itemName: '',
        description: '',
        estimatedPrice: '',
        category: '',
        priority: 'medium',
        targetDate: '',
        url: '',
        notes: ''
      });
    }, 50);
  };

  const isEditing = !!editingWishlist;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-20 z-50 flex items-center justify-center p-4" style={{backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.6)'}}>
      <div className="bg-white rounded-2xl w-full md:max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Wishlist Item' : 'Add New Wishlist Item'}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4 pr-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  value={newWishlist.itemName || ''}
                  onChange={(e) => setNewWishlist({...newWishlist, itemName: e.target.value})}
                  className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="What do you want to buy?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newWishlist.description || ''}
                  onChange={(e) => setNewWishlist({...newWishlist, description: e.target.value})}
                  className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Additional details..."
                  rows="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Price (RM)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWishlist.estimatedPrice || ''}
                    onChange={(e) => setNewWishlist({...newWishlist, estimatedPrice: e.target.value})}
                    className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newWishlist.category || ''}
                    onChange={(e) => setNewWishlist({...newWishlist, category: e.target.value})}
                    className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newWishlist.priority || 'medium'}
                    onChange={(e) => setNewWishlist({...newWishlist, priority: e.target.value})}
                    className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={newWishlist.targetDate || ''}
                    onChange={(e) => setNewWishlist({...newWishlist, targetDate: e.target.value})}
                    className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product URL</label>
                <input
                  type="url"
                  value={newWishlist.url || ''}
                  onChange={(e) => setNewWishlist({...newWishlist, url: e.target.value})}
                  className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://example.com/product"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newWishlist.notes || ''}
                  onChange={(e) => setNewWishlist({...newWishlist, notes: e.target.value})}
                  className="w-full text-sm px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Any additional notes..."
                  rows="2"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-5 flex-shrink-0">
            <button
              onClick={handleSubmit}
              className="flex-1 text-sm bg-pink-500 text-white py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
            >
              {isEditing ? 'Update' : 'Add'}
            </button>
            <button
              onClick={handleClose}
              className="flex-1 text-sm bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWishlistModal;