import React from 'react';
import { Plus, Calendar } from 'lucide-react';
import SubscriptionList from '../components/subscriptions/SubscriptionList';
import { formatCurrency } from '../utils/storage';

const SubscriptionsPage = ({
  balanceVisible,
  subscriptions,
  setShowAddForm,
  setEditingSubscription,
  setShowDeleteConfirm,
  setSubscriptionToDelete,
  getDaysUntilPayment
}) => {
  // Calculate subscription statistics
  const getTotalMonthlyCost = () => {
    return subscriptions.reduce((total, sub) => {
      const cost = sub.currentCost !== undefined ? sub.currentCost : sub.cost;
      const monthlyCost = sub.billingCycle === 'yearly' ? cost / 12 : cost;
      return total + monthlyCost;
    }, 0);
  };

  const getUpcomingPayments = () => {
    return subscriptions
      .map(sub => ({
        ...sub,
        daysUntil: getDaysUntilPayment(sub.nextPayment)
      }))
      .filter(sub => sub.daysUntil <= 7 && sub.daysUntil >= 0)
      .sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const totalMonthlyCost = getTotalMonthlyCost();
  const upcomingPayments = getUpcomingPayments();

  // Stats cards component
  const StatsCard = ({ title, value, color, subtitle }) => (
    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-center">
        <div className='text-center'>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-xl font-bold ${color}`}>
            {balanceVisible ? value : (typeof value === 'string' && value.includes('RM') ? '••••' : value)}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Statistics Cards */}
      <div className="flex gap-4">
        <StatsCard
          title="Active Subs"
          value={subscriptions.length}
          color="text-gray-700"
        />
        <StatsCard
          title="Due soon"
          value={upcomingPayments.length}
          color="text-orange-600"
        />
        <StatsCard
          title="Total"
          value={formatCurrency(totalMonthlyCost)}
          color="text-blue-600"
        />
      </div>

      {/* Upcoming Payments Alert */}
      {upcomingPayments.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="text-orange-600 animate-pulse" size={15} />
            <h3 className="font-semibold text-orange-800">Upcoming Payments</h3>
          </div>
          <div className="space-y-1">
            {upcomingPayments.map(sub => {
              const cost = sub.currentCost !== undefined ? sub.currentCost : sub.cost;
              return (
                <div key={sub.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-800">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{formatCurrency(cost)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sub.daysUntil === 0 ? 'bg-red-200 text-red-900 animate-pulse' :
                      sub.daysUntil <= 2 ? 'bg-orange-200 text-orange-900' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sub.daysUntil === 0 ? 'Due Today!' : `${sub.daysUntil} days`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Your Subscriptions</h3>
          {subscriptions.length > 0 && (
            <p className="text-sm text-gray-600">
              {subscriptions.length} sub{subscriptions.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <SubscriptionList 
          subscriptions={subscriptions}
          getDaysUntilPayment={getDaysUntilPayment}
          setShowAddForm={setShowAddForm}
          setEditingSubscription={setEditingSubscription}
          setShowDeleteConfirm={setShowDeleteConfirm}
          setSubscriptionToDelete={setSubscriptionToDelete}
        />
      </div>
    </div>
  );
};

export default SubscriptionsPage;