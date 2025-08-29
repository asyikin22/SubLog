// components/pages/WishlistPage.jsx
import React, { useState } from 'react';
import { 
  Heart, 
  Plus, 
  Edit3, 
  Trash2, 
  Tag, 
  Calendar, 
  DollarSign,
  AlertCircle,
  Gift,
  ShoppingBag,
  Gamepad2,
  Headphones,
  Book,
  Home,
  Zap,
  Car
} from 'lucide-react';
import { 
  formatCurrency,
  formatDate,
  getPriorityColor,
  getPriorityText,
  getDaysUntil
} from '../utils/storage';

  const WishlistPage = ({
  wishlistItems,
  setShowWishlistForm,
  setEditingWishlist,
  setShowDeleteConfirm,
  setWishlistToDelete
}) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');

  // Category configurations
  const getCategoryConfig = (category) => {
    const configs = {
      'Electronics': { icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', name: 'Electronics' },
      'Fashion': { icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200', name: 'Fashion' },
      'Gaming': { icon: Gamepad2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', name: 'Gaming' },
      'Books & Media': { icon: Book, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', name: 'Books & Media' },
      'Health & Beauty': { icon: Heart, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', name: 'Health & Beauty' },
      'Home & Garden': { icon: Home, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', name: 'Home & Garden' },
      'Sports & Fitness': { icon: Zap, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', name: 'Sports & Fitness' },
      'Travel': { icon: Car, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200', name: 'Travel' },
      'Gift': { icon: Gift, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200', name: 'Gift' },
      'Other': { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', name: 'Other' }
    };
    return configs[category] || configs['Other'];
  };

  // Handle edit and delete actions
  const handleEditClick = (item) => {
    setEditingWishlist(item);
    setShowWishlistForm(true);
  };

  const handleDeleteClick = (item) => {
    setWishlistToDelete(item);
    setShowDeleteConfirm(true);
  };

  const getFilteredAndSortedItems = () => {
    let filtered = wishlistItems;

    // Filter by priority
    if (filter !== 'all') {
      filtered = filtered.filter(item => item.priority === filter);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'price':
          return (b.estimatedPrice || 0) - (a.estimatedPrice || 0);
        case 'targetDate':
          if (!a.targetDate && !b.targetDate) return 0;
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return new Date(a.targetDate) - new Date(b.targetDate);
        case 'dateAdded':
        default:
          return new Date(b.dateAdded) - new Date(a.dateAdded);
      }
    });

    return filtered;
  };

  const getTotalWishlistValue = () => {
    return wishlistItems.reduce((total, item) => total + (item.estimatedPrice || 0), 0);
  };

  const getHighPriorityCount = () => {
    return wishlistItems.filter(item => item.priority === 'high').length;
  };

  // Stats card component - No icons
  const StatsCard = ({ title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );

  // Helper function to format duration with months and days
  const formatDuration = (targetDate) => {
    if (!targetDate) return null;
    
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      if (absDays >= 30) {
        const months = Math.floor(absDays / 30);
        const days = absDays % 30;
        if (days === 0) return { text: `${months}mo past`, days: diffDays };
        return { text: `${months}mo ${days}d past`, days: diffDays };
      }
      return { text: `${absDays}d past`, days: diffDays };
    }
    
    if (diffDays === 0) return { text: 'Target Today!', days: diffDays };
    
    if (diffDays >= 30) {
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      if (days === 0) return { text: `${months}mo left`, days: diffDays };
      return { text: `${months}mo ${days}d left`, days: diffDays };
    }
    
    return { text: `${diffDays}d left`, days: diffDays };
  };

  // Wishlist item card component - Only calendar, edit, and trash icons
  const WishlistCard = ({ item }) => {
    console.log('Item data:', item); // Debug the full item
    const config = getCategoryConfig(item.category);
    const duration = item.targetDate ? formatDuration(item.targetDate) : null;

    return (
      <div className={`bg-white rounded-xl p-2 shadow-sm border ${config.border} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-base truncate text-gray-900 flex items-center gap-2">
                <span className="truncate">{item.itemName}</span>
                <span className={`text-[9px] px-1 py-0.5 rounded-full whitespace-nowrap ${config.bg} ${config.color}`}>
                  {config.name}
                </span>
                <span className={`text-[9px] px-1 py-0.5 rounded-full whitespace-nowrap ${getPriorityColor(item.priority)}`}>
                  {getPriorityText(item.priority)}
                </span>
              </h4>
              {item.description && (
                <p className="text-[10px] text-gray-500 mt-1 truncate">{item.description}</p>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            {item.estimatedPrice > 0 ? (
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(item.estimatedPrice)}
              </span>
            ) : (
              <span className="text-sm text-gray-400">No price set</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-gray-600 ml-2">
            {item.targetDate ? (
              <>
                <Calendar size={12} />
                <span>Target: {formatDate(item.targetDate)}</span>
              </>
            ) : (
              <span>No target date</span>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {duration && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                duration.days < 0 ? 'bg-red-100 text-red-800' :
                duration.days === 0 ? 'bg-red-100 text-red-800 animate-pulse' :
                duration.days <= 7 ? 'bg-orange-100 text-orange-800' :
                duration.days <= 30 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {duration.text}
              </span>
            )}
            
            <button 
              onClick={() => handleEditClick(item)}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit3 size={14} />
            </button>
            <button 
              onClick={() => handleDeleteClick(item)}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {item.url && (
          <div className="mt-2 ml-2">
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-pink-600 hover:text-pink-700"
            >
              View Item →
            </a>
          </div>
        )}
      </div>
    );
  };

  const filteredItems = getFilteredAndSortedItems();

  // Empty state
  if (wishlistItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-pink-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No wishlist items yet</h3>
          <p className="text-gray-600 mb-6">Start adding items you want to buy!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
      {/* Statistics Card and Filters Row */}
      <div className="flex gap-2 items-center">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-2 py-2 border border-gray-300 rounded-lg text-sm w-24"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Med</option>
          <option value="low">Low</option>
        </select>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-2 py-2 border border-gray-300 rounded-lg text-sm w-28"
        >
          <option value="dateAdded">Newest</option>
          <option value="priority">Priority</option>
          <option value="price">Price</option>
          <option value="targetDate">Date</option>
        </select>

        <div className="ml-auto">
          <StatsCard
            title="Total Value"
            value={formatCurrency(getTotalWishlistValue())}
            color="text-pink-600"
          />
        </div>
      </div>

      {/* Section Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Your Wishlist Items</h2>
        <span className="text-sm text-gray-500">{filteredItems.length} items</span>
      </div>

      {/* Items List - Sorted by priority and price */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-8">
          <Heart size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No items match your filter</h3>
          <p className="text-gray-600">Try adjusting your filters or add more items</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;