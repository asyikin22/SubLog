import React from 'react';
import { formatCurrency, formatDate } from '../utils/storage';

const Dashboard = ({ 
  balanceVisible,
  accounts,
  subscriptions,
  expenses,
  bnplItems,
  totalFunds,
  updateAccountBalance,
  setCurrentPage,
  setShowAddForm,
  setShowExpenseForm,
  setShowBNPLForm,
  getDaysUntilPayment
}) => {
  // Calculate individual category totals
  const subscriptionTotal = subscriptions.reduce((sum, sub) => {
    const cost = sub.currentCost || sub.cost || 0;
    return sum + (sub.billingCycle === 'yearly' ? cost / 12 : cost);
  }, 0);

  const expenseTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Fixed BNPL calculation
  const bnplTotal = bnplItems.reduce((sum, bnpl) => sum + (bnpl.totalAmount || 0), 0);
  
  const totalMonthlyExpenses = subscriptionTotal + expenseTotal + bnplTotal;

  // Simple account balance display component (view-only)
  const AccountBalanceDisplay = ({ type, amount, label }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs text-gray-600 mb-1">{label}</p>
          <p className={`text-lg font-bold ${
            type === 'savings' ? 'text-green-600' : 'text-gray-900'
          }`}>
            {balanceVisible ? formatCurrency(amount) : '••••'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Overview */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
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
                <p className="text-xs text-gray-600 mb-1">Total Spend</p>
                <p className="text-lg font-bold text-red-600">
                  {balanceVisible ? formatCurrency(totalMonthlyExpenses) : '••••'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly Breakdown */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Fixed Expenses</p>
              <p className="text-base font-bold text-red-600">
                {balanceVisible ? formatCurrency(expenseTotal) : '••••'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Subscriptions</p>
              <p className="text-base font-bold text-blue-600">
                {balanceVisible ? formatCurrency(subscriptionTotal) : '••••'}
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">BNPL Payments</p>
              <p className="text-base font-bold text-purple-600">
                {balanceVisible ? formatCurrency(bnplTotal) : '••••'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;