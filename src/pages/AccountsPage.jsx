import React, { useState } from 'react';
import { PiggyBank, Target, Calendar, Plus, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { formatCurrencyWhole } from '../utils/storage';

const AccountsPage = ({ 
  balanceVisible,
  accounts,
  updateAccountBalance,
  savingsGoals,
  setSavingsGoals,
  lifeGoals,
  setLifeGoals,
  setShowSavingsGoalForm,
  setShowLifeGoalForm,
  setEditingSavingsGoal,
  setEditingLifeGoal,
  setShowDeleteSavingsGoalConfirm,
  setShowDeleteLifeGoalConfirm,
  setSavingsGoalToDelete,
  setLifeGoalToDelete
}) => {
  // REMOVED: Don't redefine formatCurrencyWhole here - use the imported one

  const calculateRemainingTime = (dueDate) => {
    if (!dueDate) return null;
    const now = new Date();
    const diffDays = Math.ceil((new Date(dueDate) - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays < 30) return `${diffDays} days left`;
    const months = Math.ceil(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} left`;
  };

  const [editingAccount, setEditingAccount] = useState(null);
  const [tempValue, setTempValue] = useState('');

  const startEditingAccount = (type, currentValue) => {
    setEditingAccount(type);
    setTempValue(currentValue.toString());
  };

  const saveAccountBalance = () => {
    if (tempValue !== '' && !isNaN(tempValue)) {
      updateAccountBalance(editingAccount, parseFloat(tempValue));
    }
    setEditingAccount(null);
    setTempValue('');
  };

  const cancelEditing = () => {
    setEditingAccount(null);
    setTempValue('');
  };

  const AccountCard = ({ type, amount, label }) => (
    <div className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm text-gray-900">{label}</h3>
        <button
          onClick={() => startEditingAccount(type, amount)}
          className="p-1 text-blue-500 hover:text-blue-600 rounded-md"
        >
          <Edit2 size={14} />
        </button>
      </div>
      {editingAccount === type ? (
        <div className="space-y-2">
          <input
            type="number"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-500"
            placeholder="Enter amount"
            autoFocus
          />
          <div className="flex space-x-1">
            <button
              onClick={saveAccountBalance}
              className="flex-1 bg-blue-500 text-white py-1 px-2 rounded-md text-sm hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={cancelEditing}
              className="flex-1 bg-gray-200 text-gray-700 py-1 px-2 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="text-lg font-semibold text-gray-900">
          {balanceVisible ? formatCurrencyWhole(amount) : '•••••'}
        </div>
      )}
    </div>
  );

  const SavingsGoalCard = ({ goal }) => {
    const progress = (goal.currentAmount / goal.targetAmount) * 100;
    const remainingTime = calculateRemainingTime(goal.dueDate);

    return (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-sm text-gray-900">{goal.name}</h3>
            <p className="text-xs text-gray-600">
              {balanceVisible ? formatCurrencyWhole(goal.currentAmount) : '••••'} / {balanceVisible ? formatCurrencyWhole(goal.targetAmount) : '••••'}
            </p>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => { setEditingSavingsGoal(goal); setShowSavingsGoalForm(true); }}
              className="p-1 text-blue-500 hover:text-blue-600"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => { setSavingsGoalToDelete(goal); setShowDeleteSavingsGoalConfirm(true); }}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{progress.toFixed(1)}%</span>
            {remainingTime && (
              <span className={`${remainingTime.includes('overdue') ? 'text-red-600' : 'text-blue-600'}`}>
                {remainingTime}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const LifeGoalCard = ({ goal }) => {
    const remainingTime = calculateRemainingTime(goal.dueDate);

    return (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-sm text-gray-900 mb-1">{goal.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                goal.category === 'health' ? 'bg-green-100 text-green-800' :
                goal.category === 'career' ? 'bg-blue-100 text-blue-800' :
                goal.category === 'personal' ? 'bg-purple-100 text-purple-800' :
                goal.category === 'relationships' ? 'bg-pink-100 text-pink-800' :
                goal.category === 'hobbies' ? 'bg-yellow-100 text-yellow-800' :
                goal.category === 'travel' ? 'bg-indigo-100 text-indigo-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {goal.category}
              </span>
              {remainingTime && (
                <span className={`flex items-center text-[10px] ml-3 ${remainingTime.includes('overdue') ? 'text-red-600' : 'text-gray-600'}`}>
                  <Calendar size={12} className="mr-1" />
                  {remainingTime}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => { setEditingLifeGoal(goal); setShowLifeGoalForm(true); }}
              className="p-1 text-blue-500 hover:text-blue-600"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={() => { setLifeGoalToDelete(goal); setShowDeleteLifeGoalConfirm(true); }}
              className="p-1 text-red-500 hover:text-red-600"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const totalBalance = accounts.checking + accounts.savings;

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 space-y-4">
      {/* Account Balances */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900">Account Balances</h2>
          <div className="text-right">
            <p className="text-xs text-gray-600">Total Balance</p>
            <p className="text-lg font-bold text-green-600">
              {balanceVisible ? formatCurrencyWhole(totalBalance) : '•••••'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <AccountCard type="checking" amount={accounts.checking} label="Checking" />
          <AccountCard type="savings" amount={accounts.savings} label="Savings" />
        </div>
      </section>

      {/* Savings Goals */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Savings Goals</h2>
          <button
            onClick={() => setShowSavingsGoalForm(true)}
            className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 text-xs"
          >
            <Plus size={12} />
          </button>
        </div>
        {savingsGoals.length === 0 ? (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <Target className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Savings Goals Yet</h3>
            <p className="text-xs text-gray-600">Start by setting your first goal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savingsGoals.map(goal => <SavingsGoalCard key={goal.id} goal={goal} />)}
          </div>
        )}
      </section>

      {/* Life Goals */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold text-gray-900">Life Goals</h2>
          <button
            onClick={() => setShowLifeGoalForm(true)}
            className="bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600 text-xs"
          >
            <Plus size={12} />
          </button>
        </div>
        {lifeGoals.length === 0 ? (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
            <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h3 className="text-sm font-medium text-gray-900 mb-1">No Life Goals Yet</h3>
            <p className="text-xs text-gray-600">Set personal goals to track your progress.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {lifeGoals.map(goal => <LifeGoalCard key={goal.id} goal={goal} />)}
          </div>
        )}
      </section>
    </div>
  );
};

export default AccountsPage;