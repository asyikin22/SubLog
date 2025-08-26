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

  // Calculate individual category totals
  const subscriptionTotal = subscriptions.reduce((sum, sub) => {
    const cost = sub.currentCost || sub.cost || 0;
    return sum + (sub.billingCycle === 'yearly' ? cost / 12 : cost);
  }, 0);

  const expenseTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const bnplTotal = bnplItems.reduce((sum, bnpl) => sum + (bnpl.totalAmount || 0), 0);
  const totalMonthlyExpenses = subscriptionTotal + expenseTotal + bnplTotal;

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
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-0.5 border border-blue-500">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center space-x-4 text-center">
              <p className="text-sm font-semibold text-gray-900">
                {currentDateTime.toLocaleDateString('en-MY', { weekday: 'long' })}
              </p>
              <span className="text-gray-400">|</span>
              <p className="text-sm font-semibold text-gray-900">
                {currentDateTime.toLocaleDateString('en-MY', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <span className="text-gray-400">|</span>
              <p className="text-sm font-semibold text-gray-900">
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
        <div className="flex gap-4">
          <AccountBalanceDisplay 
            type="savings" 
            amount={accounts.savings} 
            label="Savings" 
          />
          <AccountBalanceDisplay 
            type="checking" 
            amount={accounts.checking} 
            label="Checking" 
          />
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">Total Spend</p>
                <p className="text-base font-bold text-red-600">
                  {balanceVisible ? formatCurrency(totalMonthlyExpenses) : '••••'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Breakdown */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900">Monthly Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Fixed Expenses</p>
              <p className="text-base font-bold text-red-600">
                {balanceVisible ? formatCurrency(expenseTotal) : '••••'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Subscriptions</p>
              <p className="text-base font-bold text-blue-600">
                {balanceVisible ? formatCurrency(subscriptionTotal) : '••••'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">BNPL Payments</p>
              <p className="text-base font-bold text-purple-600">
                {balanceVisible ? formatCurrency(bnplTotal) : '••••'}
              </p>
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
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <ul className="space-y-2">
              {recentLifeGoals.map((goal) => (
                <li key={goal.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-1 h-1 bg-gray-500 rounded-full mr-3 flex-shrink-0"></span>
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