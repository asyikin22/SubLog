import { DollarSign, Trash2, Edit3, Calendar, Gift } from 'lucide-react';
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

  // Helper to check if promo is still active
  const isPromoActive = (subscription) => {
    if (!subscription.isPromo || !subscription.promoEndDate) return false;
    const today = new Date();
    const promoEnd = new Date(subscription.promoEndDate);
    return today < promoEnd;
  };

  // Helper to get days until promo ends
  const getDaysUntilPromoEnd = (promoEndDate) => {
    const today = new Date();
    const promoEnd = new Date(promoEndDate);
    const diffTime = promoEnd - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper to calculate next payment date after promo ends
  const getNextPaymentAfterPromo = (promoEndDate, billingCycle) => {
    // User gets charged ON the promo end date, then next payment is calculated from there
    const firstChargeDate = new Date(promoEndDate);
    
    // Calculate the NEXT payment after the first charge
    if (billingCycle === 'yearly') {
      firstChargeDate.setFullYear(firstChargeDate.getFullYear() + 1);
    } else {
      firstChargeDate.setMonth(firstChargeDate.getMonth() + 1);
    }
    return firstChargeDate.toISOString().split('T')[0];
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
        const categoryStyle = getCategoryStyle(subscription.category);
        const promoActive = isPromoActive(subscription);
        const daysUntilPromoEnd = subscription.promoEndDate ? getDaysUntilPromoEnd(subscription.promoEndDate) : 0;
        
        // Smart date logic - what date should we show for countdown?
        let displayDate, daysUntilEvent;
        
        if (promoActive) {
          // Still in promo - show countdown to when they'll be charged (promo end date)
          displayDate = subscription.promoEndDate;
          daysUntilEvent = daysUntilPromoEnd;
        } else if (subscription.isPromo && !promoActive) {
          // Promo has ended - show next regular payment cycle
          displayDate = getNextPaymentAfterPromo(subscription.promoEndDate, subscription.billingCycle);
          daysUntilEvent = getDaysUntilPayment(displayDate);
        } else {
          // Regular subscription - use normal next payment
          displayDate = subscription.nextPayment;
          daysUntilEvent = getDaysUntilPayment(displayDate);
        }
        
        // Use the cost from the subscription (which is currentCost)
        const currentCost = subscription.currentCost || subscription.cost || 0;
        const regularCost = subscription.regularCost;
        
        return (
          <div key={subscription.id} className={`bg-white rounded-xl p-2 shadow-sm border ${
            promoActive ? 'border-blue-200 bg-blue-50' : 'border-gray-100'
          }`}>
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <h4 className={`font-semibold text-base truncate ${categoryStyle.name}`}>
                        {subscription.name}
                      </h4>
                      {promoActive && <Gift size={14} className="text-blue-500 flex-shrink-0" />}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${categoryStyle.category}`}>
                        {subscription.category}
                      </span>
                      
                      {/* Promo badge */}
                      {subscription.isPromo && (
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                          promoActive ? 
                            currentCost === 0 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {promoActive 
                            ? currentCost === 0 ? 'FREE TRIAL' : 'PROMO'
                            : 'PROMO ENDED'
                          }
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-2 flex-shrink-0 text-right">
                    <span className="font-bold text-lg text-gray-900">
                      {currentCost === 0 ? (
                        <span className="text-green-600 text-sm">FREE</span>
                      ) : (
                        <>
                          {formatCurrency(currentCost)}
                          <span className="text-xs font-normal">/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                        </>
                      )}
                    </span>
                    
                    {/* Show regular cost after promo */}
                    {promoActive && regularCost && regularCost !== currentCost && (
                      <div className="text-xs text-gray-500">
                        then {formatCurrency(regularCost)}/{subscription.billingCycle === 'monthly' ? 'mo' : 'yr'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 text-[10px] text-gray-600 ml-2">
                {/* Show cancel nudge above date for promos */}
                <div className="flex flex-col">
                  {promoActive && regularCost && regularCost !== currentCost && (
                    <span className="text-red-500 font-medium mb-1">Evaluate before trial ends</span>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} className="text-gray-500" />
                    <span className="truncate">
                      {promoActive ? 
                        `First charge: ${formatDate(subscription.promoEndDate)}`
                        : `Next payment: ${formatDate(displayDate)}`
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Event countdown */}
                {promoActive ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    daysUntilEvent <= 0 ? 'bg-red-100 text-red-800' :
                    daysUntilEvent <= 3 ? 'bg-orange-100 text-orange-800' :
                    daysUntilEvent <= 7 ? 'bg-yellow-100 text-yellow-800' :
                    currentCost === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {daysUntilEvent <= 0 ? 'Charges Today' : 
                     daysUntilEvent === 1 ? 'Tomorrow' :
                     `${daysUntilEvent} days`}
                  </span>
                ) : (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                    daysUntilEvent < 0 ? 'bg-red-100 text-red-800' :
                    daysUntilEvent === 0 ? 'bg-red-100 text-red-800' :
                    daysUntilEvent <= 3 ? 'bg-orange-100 text-orange-800' :
                    daysUntilEvent <= 7 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {daysUntilEvent < 0 ? 'Overdue' : 
                     daysUntilEvent === 0 ? 'Due Today' : 
                     `${daysUntilEvent} days`}
                  </span>
                )}
                
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