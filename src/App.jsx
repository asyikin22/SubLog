// App.jsx - Main application component with calendar logic and error handling
import React, { useState, useEffect } from 'react';

// Import custom hooks for better state management
import { useSubscriptions } from './hooks/useSubscriptions';
import { useExpenses } from './hooks/useExpenses';
import { useBNPL } from './hooks/useBNPL';
import { useGoals } from './hooks/useGoals';
import { useAccounts } from './hooks/useAccounts';

// Import UI components
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import FloatingAddButton from './components/layout/FloatingAddButton';
import LoadingScreen from './components/common/LoadingScreen';

// Import existing modals
import AddSubscriptionModal from './components/subscriptions/AddSubscriptionModal';
import DeleteConfirmModal from './components/subscriptions/DeleteConfirmModal';
import AddExpenseModal from './components/expenses/AddExpenseModal';
import DeleteExpenseModal from './components/expenses/DeleteExpenseModal';
import AddBNPLModal from './components/bnpl/AddBNPLModal';
import DeleteBNPLModal from './components/bnpl/DeleteBNPLModal';
import AddSavingsGoalModal from './components/accounts/AddSavingsGoalModal';
import AddLifeGoalModal from './components/accounts/AddLifeGoalModal';
import { DeleteSavingsGoalModal, DeleteLifeGoalModal } from './components/accounts/DeleteGoalsModals';

// Import pages
import Dashboard from './pages/Dashboard';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ExpensesPage from './pages/ExpensesPage';
import BNPLPage from './pages/BNPLPage';
import AccountsPage from './pages/AccountsPage';

function App() {
  // App state
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [error, setError] = useState(null);

  // Custom hooks for data management
  const subscriptions = useSubscriptions();
  const expenses = useExpenses();
  const bnpl = useBNPL();
  const goals = useGoals();
  const accounts = useAccounts();

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

  // Load all data on component mount with improved error handling
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setError(null);
        
        // Load accounts first as other data might depend on it
        await accounts.loadData();
        
        // Load other data in parallel
        const loadPromises = [
          subscriptions.loadData(),
          expenses.loadData(),
          bnpl.loadData(),
          goals.loadData()
        ];
        
        await Promise.all(loadPromises);
        
        console.log('All data loaded successfully');
      } catch (error) {
        console.error('Error loading data:', error);
        setError(`Failed to load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Utility functions
  const getDaysUntilPayment = (nextPayment) => {
    const today = new Date();
    const paymentDate = new Date(nextPayment);
    const diffTime = paymentDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalFunds = () => accounts.data.checking + accounts.data.savings;
  
  // Updated to use calendar month logic instead of all expenses
  const getCurrentMonthExpenses = () => {
    const subscriptionTotal = subscriptions.data
      .filter(sub => isPaymentDueInCurrentCalendarMonth(sub.nextPayment))
      .reduce((sum, sub) => {
        const cost = sub.currentCost || sub.cost || 0;
        return sum + cost;
      }, 0);
    
    const expenseTotal = expenses.data
      .filter(exp => isPaymentDueInCurrentCalendarMonth(exp.nextDue))
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const bnplTotal = bnpl.data
      .filter(item => isPaymentDueInCurrentCalendarMonth(item.nextPaymentDate))
      .reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    
    return subscriptionTotal + expenseTotal + bnplTotal;
  };

  const getNextMonthExpenses = () => {
    const subscriptionTotal = subscriptions.data
      .filter(sub => isPaymentDueInNextCalendarMonth(sub.nextPayment))
      .reduce((sum, sub) => {
        const cost = sub.currentCost || sub.cost || 0;
        return sum + cost;
      }, 0);
    
    const expenseTotal = expenses.data
      .filter(exp => isPaymentDueInNextCalendarMonth(exp.nextDue))
      .reduce((sum, exp) => sum + exp.amount, 0);
    
    const bnplTotal = bnpl.data
      .filter(item => isPaymentDueInNextCalendarMonth(item.nextPaymentDate))
      .reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    
    return subscriptionTotal + expenseTotal + bnplTotal;
  };

  // Get total outstanding BNPL for header display
  const getTotalBNPLOutstanding = () => {
    return bnpl.data.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  };

  const renderCurrentPage = () => {
    const commonProps = {
      balanceVisible,
      getDaysUntilPayment
    };

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard
            {...commonProps}
            accounts={accounts.data}
            subscriptions={subscriptions.data}
            expenses={expenses.data}
            bnplItems={bnpl.data}
            savingsGoals={goals.savingsGoals}
            lifeGoals={goals.lifeGoals}
            totalFunds={getTotalFunds()}
            currentMonthExpenses={getCurrentMonthExpenses()}
            nextMonthExpenses={getNextMonthExpenses()}
            updateAccountBalance={accounts.updateBalance}
            setCurrentPage={setCurrentPage}
            setShowAddForm={subscriptions.setShowModal}
            setShowExpenseForm={expenses.setShowModal}
            setShowBNPLForm={bnpl.setShowModal}
            setShowSavingsGoalForm={goals.setShowSavingsGoalModal}
            setShowLifeGoalForm={goals.setShowLifeGoalModal}
          />
        );
      case 'subscriptions':
        return (
          <SubscriptionsPage
            {...commonProps}
            subscriptions={subscriptions.data}
            setShowAddForm={subscriptions.setShowModal}
            setEditingSubscription={subscriptions.setEditing}
            setShowDeleteConfirm={subscriptions.setShowDeleteModal}
            setSubscriptionToDelete={subscriptions.setToDelete}
          />
        );
      case 'expenses':
        return (
          <ExpensesPage
            {...commonProps}
            expenses={expenses.data}
            setShowExpenseForm={expenses.setShowModal}
            setEditingExpense={expenses.setEditing}
            setShowDeleteConfirm={expenses.setShowDeleteModal}
            setExpenseToDelete={expenses.setToDelete}
          />
        );
      case 'bnpl':
        return (
          <BNPLPage
            {...commonProps}
            bnplItems={bnpl.data}
            setShowBNPLForm={bnpl.setShowModal}
            setEditingBNPL={bnpl.setEditing}
            setShowDeleteConfirm={bnpl.setShowDeleteModal}
            setBNPLToDelete={bnpl.setToDelete}
          />
        );
      case 'accounts':
        return (
          <AccountsPage
            {...commonProps}
            accounts={accounts.data}
            updateAccountBalance={accounts.updateBalance}
            savingsGoals={goals.savingsGoals}
            setSavingsGoals={goals.setSavingsGoals}
            lifeGoals={goals.lifeGoals}
            setLifeGoals={goals.setLifeGoals}
            setShowSavingsGoalForm={goals.setShowSavingsGoalModal}
            setShowLifeGoalForm={goals.setShowLifeGoalModal}
            setEditingSavingsGoal={goals.setEditingSavingsGoal}
            setEditingLifeGoal={goals.setEditingLifeGoal}
            setShowDeleteSavingsGoalConfirm={goals.setShowDeleteSavingsGoalModal}
            setShowDeleteLifeGoalConfirm={goals.setShowDeleteLifeGoalModal}
            setSavingsGoalToDelete={goals.setSavingsGoalToDelete}
            setLifeGoalToDelete={goals.setLifeGoalToDelete}
          />
        );
      default:
        return (
          <Dashboard 
            {...commonProps}
            accounts={accounts.data}
            subscriptions={subscriptions.data}
            expenses={expenses.data}
            bnplItems={bnpl.data}
            savingsGoals={goals.savingsGoals}
            lifeGoals={goals.lifeGoals}
            totalFunds={getTotalFunds()}
            currentMonthExpenses={getCurrentMonthExpenses()}
            nextMonthExpenses={getNextMonthExpenses()}
            updateAccountBalance={accounts.updateBalance}
            setCurrentPage={setCurrentPage}
            setShowAddForm={subscriptions.setShowModal}
            setShowExpenseForm={expenses.setShowModal}
            setShowBNPLForm={bnpl.setShowModal}
            setShowSavingsGoalForm={goals.setShowSavingsGoalModal}
            setShowLifeGoalForm={goals.setShowLifeGoalModal}
          />
        );
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg border border-red-200 max-w-md w-full">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        balanceVisible={balanceVisible}
        setBalanceVisible={setBalanceVisible}
        subscriptions={subscriptions.data}
        expenses={expenses.data}
        bnplItems={bnpl.data}
        currentMonthExpenses={getCurrentMonthExpenses()}
        totalBNPLOutstanding={getTotalBNPLOutstanding()}
      />
      
      <main className="pb-16">
        {renderCurrentPage()}
      </main>

      <NavBar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <FloatingAddButton 
        currentPage={currentPage}
        subscriptions={subscriptions}
        expenses={expenses}
        bnpl={bnpl}
        goals={goals}
      />

      {/* All modals - using existing modal components */}
      <AddSubscriptionModal 
        showAddForm={subscriptions.showModal}
        setShowAddForm={subscriptions.setShowModal}
        newSubscription={subscriptions.formData}
        setNewSubscription={subscriptions.setFormData}
        addSubscription={subscriptions.add}
        editingSubscription={subscriptions.editing}
        setEditingSubscription={subscriptions.setEditing}
        updateSubscription={subscriptions.update}
      />

      <DeleteConfirmModal 
        showDeleteConfirm={subscriptions.showDeleteModal}
        setShowDeleteConfirm={subscriptions.setShowDeleteModal}
        subscriptionToDelete={subscriptions.toDelete}
        confirmDelete={subscriptions.confirmDelete}
      />

      <AddExpenseModal 
        showExpenseForm={expenses.showModal}
        setShowExpenseForm={expenses.setShowModal}
        newExpense={expenses.formData}
        setNewExpense={expenses.setFormData}
        addExpense={expenses.add}
        editingExpense={expenses.editing}
        setEditingExpense={expenses.setEditing}
        updateExpense={expenses.update}
      />

      <DeleteExpenseModal 
        showDeleteConfirm={expenses.showDeleteModal}
        setShowDeleteConfirm={expenses.setShowDeleteModal}
        expenseToDelete={expenses.toDelete}
        confirmDelete={expenses.confirmDelete}
      />

      <AddBNPLModal 
        showBNPLForm={bnpl.showModal}
        setShowBNPLForm={bnpl.setShowModal}
        newBNPL={bnpl.formData}
        setNewBNPL={bnpl.setFormData}
        addBNPL={bnpl.add}
        editingBNPL={bnpl.editing}
        setEditingBNPL={bnpl.setEditing}
        updateBNPL={bnpl.update}
      />

      <DeleteBNPLModal 
        showDeleteConfirm={bnpl.showDeleteModal}
        setShowDeleteConfirm={bnpl.setShowDeleteModal}
        bnplToDelete={bnpl.toDelete}
        confirmDelete={bnpl.confirmDelete}
      />

      <AddSavingsGoalModal 
        showSavingsGoalForm={goals.showSavingsGoalModal}
        setShowSavingsGoalForm={goals.setShowSavingsGoalModal}
        newSavingsGoal={goals.savingsGoalFormData}
        setNewSavingsGoal={goals.setSavingsGoalFormData}
        addSavingsGoal={goals.addSavingsGoal}
        editingSavingsGoal={goals.editingSavingsGoal}
        setEditingSavingsGoal={goals.setEditingSavingsGoal}
        updateSavingsGoal={goals.updateSavingsGoal}
      />

      <AddLifeGoalModal 
        showLifeGoalForm={goals.showLifeGoalModal}
        setShowLifeGoalForm={goals.setShowLifeGoalModal}
        newLifeGoal={goals.lifeGoalFormData}
        setNewLifeGoal={goals.setLifeGoalFormData}
        addLifeGoal={goals.addLifeGoal}
        editingLifeGoal={goals.editingLifeGoal}
        setEditingLifeGoal={goals.setEditingLifeGoal}
        updateLifeGoal={goals.updateLifeGoal}
      />

      <DeleteSavingsGoalModal 
        showDeleteConfirm={goals.showDeleteSavingsGoalModal}
        setShowDeleteConfirm={goals.setShowDeleteSavingsGoalModal}
        savingsGoalToDelete={goals.savingsGoalToDelete}
        confirmDelete={goals.confirmDeleteSavingsGoal}
      />

      <DeleteLifeGoalModal 
        showDeleteConfirm={goals.showDeleteLifeGoalModal}
        setShowDeleteConfirm={goals.setShowDeleteLifeGoalModal}
        lifeGoalToDelete={goals.lifeGoalToDelete}
        confirmDelete={goals.confirmDeleteLifeGoal}
      />
    </div>
  );
}

export default App;