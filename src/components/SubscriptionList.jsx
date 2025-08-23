import { DollarSign, Trash2, Edit3, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/storage';

const SubscriptionList = ({ 
  subscriptions, 
  deleteSubscription, 
  getDaysUntilPayment, 
  setShowAddForm,
  setEditingSubscription,
  setShowDeleteConfirm,
  setSubscriptionToDelete
}) => {
  // Category styling configuration
  const getCategoryStyle = (category) => {
    const styles = {
      entertainment: {
        name: 'text-purple-700',
        category: 'text-purple-500 bg-purple-50',
        icon: '🎬'
      },
      productivity: {
        name: 'text-blue-700',
        category: 'text-blue-500 bg-blue-50',
        icon: '💼'
      },
      fitness: {
        name: 'text-green-700',
        category: 'text-green-500 bg-green-50',
        icon: '💪'
      },
      music: {
        name: 'text-pink-700',
        category: 'text-pink-500 bg-pink-50',
        icon: '🎵'
      },
      news: {
        name: 'text-orange-700',
        category: 'text-orange-500 bg-orange-50'
      },
      technology: {
        name: 'text-orange-700',
        category: 'text-orange-500 bg-orange-50'
      },
      other: {
        name: 'text-gray-700',
        category: 'text-gray-500 bg-gray-50',
        icon: '📱'
      }
    };
    return styles[category] || styles.other;
  };

  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No subscriptions yet</h3>
        <p className="text-gray-600 mb-4">Start tracking your monthly expenses</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Add Your First Subscription
        </button>
      </div>
    );
  }

  const handleDeleteClick = (subscription) => {
    setSubscriptionToDelete(subscription);
    setShowDeleteConfirm(true);
  };

  const handleEditClick = (subscription) => {
    setEditingSubscription(subscription);
    setShowAddForm(true);
  };

  return (
    <div className="space-y-2">
      {subscriptions.map(subscription => {
        const daysUntil = getDaysUntilPayment(subscription.nextPayment);
        const categoryStyle = getCategoryStyle(subscription.category);
        
        return (
          <div key={subscription.id} className="bg-white rounded-xl p-2 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <h4 className={`font-semibold text-base truncate ${categoryStyle.name}`}>
                      {subscription.name}
                    </h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${categoryStyle.category}`}>
                      {subscription.category}
                    </span>
                  </div>
                  <span className="font-bold text-lg text-gray-900 ml-2 flex-shrink-0">
                    {formatCurrency(subscription.cost)}
                    <span className="text-xs font-normal">/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-gray-600 ml-2">
                <Calendar size={12} className="text-gray-500" />
                <span className="truncate">{formatDate(subscription.nextPayment)}</span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  daysUntil < 0 ? 'bg-red-100 text-red-800' :
                  daysUntil === 0 ? 'bg-red-100 text-red-800' :
                  daysUntil <= 3 ? 'bg-orange-100 text-orange-800' :
                  daysUntil <= 7 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {daysUntil < 0 ? 'Overdue' : 
                   daysUntil === 0 ? 'Due Today' : 
                   `${daysUntil}d`}
                </span>
                <button
                  onClick={() => handleEditClick(subscription)}
                  className="text-blue-500 hover:text-blue-700 transition-colors p-1 hover:bg-blue-50 rounded"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDeleteClick(subscription)}
                  className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubscriptionList;