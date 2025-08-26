import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Plus, ArrowRight } from 'lucide-react';

const Dashboard = ({ 
  balanceVisible,
  accounts,
  subscriptions,
  expenses,
  bnplItems,
  savingsGoals,
  lifeGoals,
  totalFunds,
  updateAccountBalance,
  setCurrentPage,
  setShowAddForm,
  setShowExpenseForm,
  setShowBNPLForm,
  setShowSavingsGoalForm,
  setShowLifeGoalForm,
  getDaysUntilPayment
}) => {
  // State for current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

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

  // Format date and time for Malaysian locale
  const formatDateTime = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kuala_Lumpur'
    };
    
    return date.toLocaleDateString('en-MY', options);
  };

  // Updated currency formatting functions to match database utility
  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount);
    return `RM${numAmount.toLocaleString('en-MY', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatCurrencyWhole = (amount) => {
    const numAmount = Math.round(parseFloat(amount));
    return `RM${numAmount.toLocaleString('en-MY')}`;
  };

  const calculateRemainingTime = (dueDate) => {
    if (!dueDate) return null;
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays < 30) {
      return `${diffDays} days left`;
    } else {
      const months = Math.ceil(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''} left`;
    }
  };

  // Calculate calendar month totals for each category
  const getSubscriptionTotals = () => {
    const currentMonth = subscriptions
      .filter(sub => isPaymentDueInCurrentCalendarMonth(sub.nextPayment))
      .reduce((sum, sub) => {
        const cost = sub.currentCost || sub.cost || 0;
        return sum + cost;
      }, 0);

    const nextMonth = subscriptions
      .filter(sub => isPaymentDueInNextCalendarMonth(sub.nextPayment))
      .reduce((sum, sub) => {
        const cost = sub.currentCost || sub.cost || 0;
        return sum + cost;
      }, 0);

    return { currentMonth, nextMonth };
  };

  const getExpenseTotals = () => {
    const currentMonth = expenses
      .filter(exp => isPaymentDueInCurrentCalendarMonth(exp.nextDue))
      .reduce((sum, exp) => sum + exp.amount, 0);

    const nextMonth = expenses
      .filter(exp => isPaymentDueInNextCalendarMonth(exp.nextDue))
      .reduce((sum, exp) => sum + exp.amount, 0);

    return { currentMonth, nextMonth };
  };

  const getBNPLTotals = () => {
    const currentMonth = bnplItems
      .filter(item => isPaymentDueInCurrentCalendarMonth(item.nextPaymentDate))
      .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    const nextMonth = bnplItems
      .filter(item => isPaymentDueInNextCalendarMonth(item.nextPaymentDate))
      .reduce((sum, item) => sum + (item.totalAmount || 0), 0);

    return { currentMonth, nextMonth };
  };

  // Get totals for each category
  const subscriptionTotals = getSubscriptionTotals();
  const expenseTotals = getExpenseTotals();
  const bnplTotals = getBNPLTotals();

  // Combined totals
  const currentMonthTotal = subscriptionTotals.currentMonth + expenseTotals.currentMonth + bnplTotals.currentMonth;
  const nextMonthTotal = subscriptionTotals.nextMonth + expenseTotals.nextMonth + bnplTotals.nextMonth;

  // Get upcoming goals and tasks
  const upcomingSavingsGoals = savingsGoals
    .filter(goal => {
      const daysLeft = Math.ceil((new Date(goal.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft <= 30 && daysLeft > 0;
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 2);

  const recentLifeGoals = lifeGoals
    .sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0))
    .slice(0, 3);

  // Simple account balance display component
  const AccountBalanceDisplay = ({ type, amount, label }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className={`text-base font-bold ${
            type === 'savings' ? 'text-green-600' : 'text-gray-900'
          }`}>
            {balanceVisible ? formatCurrencyWhole(amount) : '••••'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Date and Time Display */}
      <section>
        <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg p-0.5 border border-emerald-500">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center space-x-4 text-center">
              <p className="text-sm font-semibold text-emerald-900">
                {currentDateTime.toLocaleDateString('en-MY', { weekday: 'long' })}
              </p>
              <span className="text-gray-400">|</span>
              <p className="text-sm font-semibold text-emerald-900">
                {currentDateTime.toLocaleDateString('en-MY', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <span className="text-gray-400">|</span>
              <p className="text-sm font-semibold text-emerald-900">
                {currentDateTime.toLocaleTimeString('en-MY', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Asia/Kuala_Lumpur'
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Overview</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white rounded-lg py-2 px-3 shadow-lg border border-gray-500">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Savings</p>
              <p className="text-base font-bold text-green-600 min-h-[20px]">
                {balanceVisible ? formatCurrencyWhole(accounts.savings) : '••••'}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg py-2 px-3 shadow-lg border border-gray-500">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Checking</p>
              <p className="text-base font-bold text-gray-900 min-h-[20px]">
                {balanceVisible ? formatCurrencyWhole(accounts.checking) : '••••'}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg py-2 px-3 shadow-lg border border-gray-500">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                {`Due ${new Date().toLocaleDateString('en-US', { month: 'long' })}`}
              </p>
              <p className="text-base font-bold text-red-600 min-h-[20px]">
                {balanceVisible ? formatCurrency(currentMonthTotal) : '••••'}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg py-2 px-3 shadow-lg border border-gray-500">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">
                {`Due ${new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'long' })}`}
              </p>
              <p className="text-base font-bold text-blue-600 min-h-[20px]">
                {balanceVisible ? formatCurrency(nextMonthTotal) : '••••'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Breakdown */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-lg shadow-sm border-2 border-orange-300 overflow-hidden">
            <div className="bg-orange-50 px-3 py-0.5 border-b border-orange-100">
              <p className="text-sm font-medium text-orange-700 text-center">Fixed</p>
            </div>
            <div className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date().toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="font-bold text-red-600 text-sm">
                  {balanceVisible ? formatCurrency(expenseTotals.currentMonth) : '••••'}
                </p>
              </div>
              <div className="border-t border-gray-300"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="font-bold text-blue-600 text-sm">
                  {balanceVisible ? formatCurrency(expenseTotals.nextMonth) : '••••'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border-2 border-indigo-300 overflow-hidden">
            <div className="bg-indigo-50 px-3 py-0.5 border-b border-indigo-100">
              <p className="text-sm font-medium text-indigo-700 text-center">Subs</p>
            </div>
            <div className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date().toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="font-bold text-red-600 text-sm">
                  {balanceVisible ? formatCurrency(subscriptionTotals.currentMonth) : '••••'}
                </p>
              </div>
              <div className="border-t border-gray-300"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="font-bold text-blue-600 text-sm">
                  {balanceVisible ? formatCurrency(subscriptionTotals.nextMonth) : '••••'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border-2 border-teal-300 overflow-hidden">
            <div className="bg-teal-50 px-3 py-0.5 border-b border-teal-100">
              <p className="text-sm font-medium text-teal-700 text-center">BNPL</p>
            </div>
            <div className="p-3 space-y-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date().toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="font-bold text-red-600 text-sm">
                  {balanceVisible ? formatCurrency(bnplTotals.currentMonth) : '••••'}
                </p>
              </div>
              <div className="border-t border-gray-300"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="font-bold text-blue-600 text-sm">
                  {balanceVisible ? formatCurrency(bnplTotals.nextMonth) : '••••'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Savings Goals */}
      {upcomingSavingsGoals.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Goals</h2>
            <button
              onClick={() => setCurrentPage('accounts')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingSavingsGoals.map(goal => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remainingTime = calculateRemainingTime(goal.dueDate);
              
              return (
                <div key={goal.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{goal.name}</h3>
                    {remainingTime && (
                      <span className={`text-sm ${remainingTime.includes('overdue') ? 'text-red-600' : 'text-blue-600'}`}>
                        {remainingTime}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>
                      {balanceVisible ? formatCurrencyWhole(goal.currentAmount) : '••••'} of {balanceVisible ? formatCurrencyWhole(goal.targetAmount) : '••••'}
                    </span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent Life Goals */}
      {recentLifeGoals.length > 0 && (
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Life Goals</h2>
          </div>
          <div className="bg-rose-50 rounded-lg p-3 shadow-sm border-2 border-rose-400">
            <ul className="space-y-2">
              {recentLifeGoals.map((goal) => (
                <li key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-rose-500 rounded-full mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm">{goal.title}</span>
                  </div>
                  {goal.dueDate && (
                    <span className={`text-[10px] ml-4 flex-shrink-0 ${
                      calculateRemainingTime(goal.dueDate)?.includes('overdue') ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {calculateRemainingTime(goal.dueDate)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;