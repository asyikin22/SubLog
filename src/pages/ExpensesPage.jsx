import React from 'react';
import { 
  Home, 
  Car, 
  Smartphone, 
  Zap, 
  Wifi, 
  TrendingUp, 
  Calendar,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/storage';

const ExpensesPage = ({
  balanceVisible,
  expenses,
  setShowExpenseForm,
  setEditingExpense,
  setShowDeleteConfirm,
  setExpenseToDelete,
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

  // Category configurations
  const getCategoryConfig = (category) => {
    const configs = {
      housing: { icon: Home, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', name: 'Housing' },
      transport: { icon: Car, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', name: 'Transport' },
      utilities: { icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200', name: 'Utilities' },
      phone: { icon: Smartphone, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', name: 'Phone' },
      internet: { icon: Wifi, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', name: 'Internet' },
      other: { icon: AlertCircle, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', name: 'Other' }
    };
    return configs[category] || configs.other;
  };

  // Calculate statistics with calendar month logic
  const currentMonthTotal = expenses
    .filter(exp => isPaymentDueInCurrentCalendarMonth(exp.nextDue))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const nextMonthTotal = expenses
    .filter(exp => isPaymentDueInNextCalendarMonth(exp.nextDue))
    .reduce((sum, exp) => sum + exp.amount, 0);

  const upcomingExpenses = expenses
    .map(exp => ({ ...exp, daysUntil: getDaysUntilPayment(exp.nextDue) }))
    .filter(exp => exp.daysUntil <= 7 && exp.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(expense);
    return acc;
  }, {});

  // Handle edit and delete actions
  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  };

  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setShowDeleteConfirm(true);
  };

  // Stats card component - No icons
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

  // Expense card component - Only calendar, edit, and trash icons
  const ExpenseCard = ({ expense }) => {
    const config = getCategoryConfig(expense.category);
    const daysUntil = getDaysUntilPayment(expense.nextDue);

    return (
      <div className={`bg-white rounded-xl p-2 shadow-sm border ${config.border} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-base truncate text-gray-900">{expense.name}</h4>
              <p className={`text-[10px] px-1.5 py-0.5 rounded-full inline-block ${config.bg} ${config.color}`}>
                {config.name}
              </p>
              {expense.description && (
                <p className="text-[10px] text-gray-500 mt-1 truncate">{expense.description}</p>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(expense.amount)}
              <span className="text-[10px] font-normal">/mo</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] text-gray-600 ml-2">
            <Calendar size={12} />
            <span>Next due: {formatDate(expense.nextDue)}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              daysUntil < 0 ? 'bg-red-100 text-red-800' :
              daysUntil === 0 ? 'bg-red-100 text-red-800 animate-pulse' :
              daysUntil <= 3 ? 'bg-orange-100 text-orange-800' :
              daysUntil <= 7 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {daysUntil < 0 ? `${Math.abs(daysUntil)} days overdue` :
               daysUntil === 0 ? 'Due Today!' :
               `${daysUntil} days`}
            </span>
            
            <button 
              onClick={() => handleEditClick(expense)}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            >
              <Edit3 size={14} />
            </button>
            <button 
              onClick={() => handleDeleteClick(expense)}
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
  if (expenses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No large expenses yet</h3>
          <p className="text-gray-600 mb-6">Start tracking your major recurring expenses like rent, loans, and utilities</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-5">
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

      {/* Upcoming Expenses - No overdue section */}
      {upcomingExpenses.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-2">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="text-orange-600" size={15} />
            <h3 className="font-semibold text-orange-800">Due This Week</h3>
          </div>
          <div className="space-y-1">
            {upcomingExpenses.map(exp => (
              <div key={exp.id} className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-800">{exp.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{formatCurrency(exp.amount)}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    exp.daysUntil === 0 ? 'bg-red-200 text-red-900 animate-pulse' :
                    exp.daysUntil <= 2 ? 'bg-orange-200 text-orange-900' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exp.daysUntil === 0 ? 'Due Today!' : `${exp.daysUntil} days`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Title */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Your Fixed Expenses</h2>
        <span className="text-sm text-gray-500">{expenses.length} items</span>
      </div>

      {/* All Expenses - Sorted by amount (highest to lowest) */}
      <div className="space-y-2">
        {[...expenses].sort((a, b) => b.amount - a.amount).map(expense => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default ExpensesPage;