// App.jsx - Main application component (simplified)
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

// Import existing modals (keeping your current modal imports)
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

  // Custom hooks for data management
  const subscriptions = useSubscriptions();
  const expenses = useExpenses();
  const bnpl = useBNPL();
  const goals = useGoals();
  const accounts = useAccounts();

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        await Promise.all([
          subscriptions.loadData(),
          expenses.loadData(),
          bnpl.loadData(),
          goals.loadData(),
          accounts.loadData()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
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
  
  const getTotalMonthlyExpenses = () => {
    const subscriptionTotal = subscriptions.data.reduce((sum, sub) => {
      const cost = sub.currentCost || sub.cost || 0;
      return sum + (sub.billingCycle === 'yearly' ? cost / 12 : cost);
    }, 0);
    
    const expenseTotal = expenses.data.reduce((sum, exp) => sum + exp.amount, 0);
    const bnplTotal = bnpl.data.reduce((sum, bnplItem) => sum + (bnplItem.totalAmount || 0), 0);
    
    return subscriptionTotal + expenseTotal + bnplTotal;
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
            totalMonthlyExpenses={getTotalMonthlyExpenses()}
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
        return <Dashboard {...commonProps} />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        balanceVisible={balanceVisible}
        setBalanceVisible={setBalanceVisible}
        subscriptions={subscriptions.data}
        expenses={expenses.data}
        bnplItems={bnpl.data}
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