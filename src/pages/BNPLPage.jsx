import React from 'react';
import { 
  ShoppingBag, 
  Car, 
  Smartphone, 
  CreditCard, 
  Truck, 
  Calendar,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/storage';

const BNPLPage = ({
  balanceVisible,
  bnplItems,
  setShowBNPLForm,
  setEditingBNPL,
  setShowDeleteConfirm,
  setBNPLToDelete,
  getDaysUntilPayment
}) => {
  // Calendar month helper functions
  const isPaymentDueInCurrentCalendarMonth = (paymentDate) => {
    const today = new Date();
    const payment = new Date(paymentDate);
    return payment.getMonth() === today.getMonth() && 
           payment.getFullYear() === today.getFullYear();
  };

  const isPaymentDueInNextCalendarMonth = (paymentDate) => {
    const today = new Date();
    const payment = new Date(paymentDate);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return payment.getMonth() === nextMonth.getMonth() && 
           payment.getFullYear() === nextMonth.getFullYear();
  };

  // Platform configurations
  const getPlatformConfig = (platform) => {
    const configs = {
      grab: { icon: Car, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', name: 'Grab' },
      shopee: { icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', name: 'Shopee' },
      atome: { icon: CreditCard, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', name: 'Atome' },
      maybank: { icon: CreditCard, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', name: 'Maybank' },
      publicbank: { icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', name: 'Public Bank' },
      riipay: { icon: Smartphone, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200', name: 'RiiPay' },
      other: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', name: 'Other' }
    };
    return configs[platform] || configs.other;
  };

  // Format days into months and days
  const formatDaysUntilPayment = (days) => {
    if (days < 0) {
      const absDays = Math.abs(days);
      if (absDays < 30) {
        return `${absDays} days overdue`;
      } else {
        const months = Math.floor(absDays / 30);
        const remainingDays = absDays % 30;
        if (remainingDays === 0) {
          return `${months} month${months > 1 ? 's' : ''} overdue`;
        }
        return `${months} month${months > 1 ? 's' : ''} ${remainingDays} days overdue`;
      }
    }
    
    if (days === 0) {
      return 'Due Today!';
    }
    
    if (days < 30) {
      return `${days} days`;
    }
    
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    
    if (remainingDays === 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    
    return `${months} month${months > 1 ? 's' : ''} ${remainingDays} days`;
  };

  // Calculate statistics with calendar month logic
  const totalOutstandingAmount = bnplItems.reduce((sum, item) => sum + item.totalAmount, 0);
  
  const currentMonthTotal = bnplItems
    .filter(item => isPaymentDueInCurrentCalendarMonth(item.nextPaymentDate))
    .reduce((sum, item) => sum + item.totalAmount, 0);
    
  const nextMonthTotal = bnplItems
    .filter(item => isPaymentDueInNextCalendarMonth(item.nextPaymentDate))
    .reduce((sum, item) => sum + item.totalAmount, 0);
  
  const upcomingPayments = bnplItems
    .map(item => ({ ...item, daysUntil: getDaysUntilPayment(item.nextPaymentDate) }))
    .filter(item => item.daysUntil <= 7 && item.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // Handle edit and delete actions
  const handleEditClick = (item) => {
    setEditingBNPL(item);
    setShowBNPLForm(true);
  };

  const handleDeleteClick = (item) => {
    setBNPLToDelete(item);
    setShowDeleteConfirm(true);
  };

  // Stats card component
  const StatsCard = ({ title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-100">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-xl font-bold ${color}`}>
          {balanceVisible ? value : (typeof value === 'string' && value.includes('RM') ? '••••' : value)}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );

  // BNPL item card component
  const BNPLCard = ({ item }) => {
    const config = getPlatformConfig(item.platform);
    const daysUntil = getDaysUntilPayment(item.nextPaymentDate);

    return (
      <div className={`bg-white rounded-xl p-2 shadow-sm border ${config.border} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-base truncate text-gray-900">{item.itemName}</h4>
              <p className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block ${config.bg} ${config.color}`}>
                {config.name}
              </p>
              {item.description && (
                <p className="text-[10px] text-gray-500 mt-1 truncate">{item.description}</p>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(item.totalAmount)}
              <span className="text-[10px] font-normal"> total</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-gray-600 ml-2">
            <Calendar size={12} />
            <span>Next payment: {formatDate(item.nextPaymentDate)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              daysUntil < 0 ? 'bg-red-100 text-red-800' :
              daysUntil === 0 ? 'bg-red-100 text-red-800 animate-pulse' :
              daysUntil <= 3 ? 'bg-orange-100 text-orange-800' :
              daysUntil <= 7 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {formatDaysUntilPayment(daysUntil)}
            </span>
            
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
      </div>
    );
  };

  // Empty state
  if (bnplItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No BNPL items yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your Buy Now Pay Later purchases and installments</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Statistics Cards */}
      <div className="flex gap-4">
        <div className="flex-1">
          <StatsCard
            title={`Due ${new Date().toLocaleDateString('en-US', { month: 'long' })}`}
            value={formatCurrency(currentMonthTotal)}
            color="text-red-600"
          />
        </div>
        <div className="flex-1">
          <StatsCard
            title={`Due ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long' })}`}
            value={formatCurrency(nextMonthTotal)}
            color="text-blue-600"
          />
        </div>
      </div>

      {/* Total Outstanding Note */}
      <div className="bg-yellow-100 rounded-lg p-2 border border-yellow-500">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-800">Total Outstanding Amount</p>
          <p className="text-md font-bold text-gray-800">
            {balanceVisible ? formatCurrency(totalOutstandingAmount) : '••••'}
          </p>
        </div>
      </div>

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-orange-600" size={20} />
            <h3 className="font-semibold text-orange-800">Due This Week</h3>
          </div>
          <div className="space-y-1">
            {upcomingPayments.map(item => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">{item.itemName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{formatCurrency(item.totalAmount)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.daysUntil === 0 ? 'bg-red-200 text-red-900 animate-pulse' :
                    item.daysUntil <= 2 ? 'bg-orange-200 text-orange-900' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {formatDaysUntilPayment(item.daysUntil)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Your BNPL Items</h2>
        <span className="text-sm text-gray-500">{bnplItems.length} items</span>
      </div>

      {/* All BNPL Items - Sorted by total amount (highest to lowest) */}
      <div className="space-y-2">
        {[...bnplItems].sort((a, b) => b.totalAmount - a.totalAmount).map(item => (
          <BNPLCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default BNPLPage;