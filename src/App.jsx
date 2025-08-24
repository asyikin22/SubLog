import React, { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  Smartphone, 
  ShoppingCart, 
  Plus,
  Eye,
  EyeOff,
  DollarSign
} from 'lucide-react';

// Import your existing components (keep them unchanged)
import AddSubscriptionModal from './components/subscriptions/AddSubscriptionModal';
import DeleteConfirmModal from './components/subscriptions/DeleteConfirmModal';

// Import the new expense components
import AddExpenseModal from './components/expenses/AddExpenseModal';
import DeleteExpenseModal from './components/expenses/DeleteExpenseModal';

// Import the new BNPL components
import AddBNPLModal from './components/bnpl/AddBNPLModal';
import DeleteBNPLModal from './components/bnpl/DeleteBNPLModal';

// Import the page components
import Dashboard from './pages/Dashboard';
import SubscriptionsPage from './pages/SubscriptionsPage';
import ExpensesPage from './pages/ExpensesPage';
import BNPLPage from './pages/BNPLPage';

// Enhanced storage utilities
import { 
  // Existing subscription functions (unchanged)
  getSubscriptions, 
  addSubscription as addSubscriptionToDB, 
  updateSubscription as updateSubscriptionInDB,
  deleteSubscription as deleteSubscriptionFromDB,
  
  // New functions for other categories
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getBNPLItems,
  addBNPLItem,
  updateBNPLItem,
  deleteBNPLItem,
  getAccounts,
  updateAccounts
} from './utils/storage';

function App() {
  // Navigation state
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [balanceVisible, setBalanceVisible] = useState(true);

  // Data state for all categories
  const [subscriptions, setSubscriptions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [bnplItems, setBNPLItems] = useState([]);
  const [accounts, setAccounts] = useState({ checking: 0, savings: 0 });

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showBNPLForm, setShowBNPLForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteExpenseConfirm, setShowDeleteExpenseConfirm] = useState(false);
  const [showDeleteBNPLConfirm, setShowDeleteBNPLConfirm] = useState(false);
  
  // Edit states for subscriptions
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  
  // Edit states for expenses
  const [editingExpense, setEditingExpense] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  
  // Edit states for BNPL
  const [editingBNPL, setEditingBNPL] = useState(null);
  const [bnplToDelete, setBNPLToDelete] = useState(null);
  
  // Form states
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    currentCost: '',
    regularCost: '',
    billingCycle: 'monthly',
    nextPayment: '',
    category: 'entertainment',
    isPromo: false,
    promoEndDate: ''
  });

  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    category: 'housing',
    nextDue: '',
    description: ''
  });

  const [newBNPL, setNewBNPL] = useState({
    itemName: '',
    totalAmount: '',
    platform: 'grab',
    nextPaymentDate: '',
    description: ''
  });

  // Load all data on component mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [savedSubs, savedExpenses, savedBNPL, savedAccounts] = await Promise.all([
          getSubscriptions(),
          getExpenses(),
          getBNPLItems(),
          getAccounts()
        ]);
        
        setSubscriptions(savedSubs);
        setExpenses(savedExpenses);
        setBNPLItems(savedBNPL);
        setAccounts(savedAccounts);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // =============================================
  // SUBSCRIPTION FUNCTIONS (keep unchanged)
  // =============================================
  const addSubscription = async (subscriptionData) => {
    const dataToUse = subscriptionData || newSubscription;
    
    if (dataToUse.name && (dataToUse.currentCost || dataToUse.currentCost === '0') && dataToUse.nextPayment) {
      try {
        const subscription = {
          ...dataToUse,
          id: Date.now(),
          cost: parseFloat(dataToUse.currentCost) || 0,
          currentCost: parseFloat(dataToUse.currentCost) || 0,
          regularCost: dataToUse.regularCost ? parseFloat(dataToUse.regularCost) : null,
          promoEndDate: dataToUse.isPromo ? dataToUse.nextPayment : dataToUse.promoEndDate,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addSubscriptionToDB(subscription);
        setSubscriptions([...subscriptions, subscription]);
        
        setNewSubscription({
          name: '', currentCost: '', regularCost: '', billingCycle: 'monthly',
          nextPayment: '', category: 'entertainment', isPromo: false, promoEndDate: ''
        });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding subscription:', error);
        alert('Error adding subscription: ' + error.message);
      }
    }
  };

  const updateSubscription = async (subscriptionData) => {
    const dataToUse = subscriptionData || newSubscription;
    
    if (dataToUse.name && (dataToUse.currentCost || dataToUse.currentCost === '0') && dataToUse.nextPayment && editingSubscription) {
      try {
        const updatedSubscription = {
          ...editingSubscription,
          ...dataToUse,
          cost: parseFloat(dataToUse.currentCost) || 0,
          currentCost: parseFloat(dataToUse.currentCost) || 0,
          regularCost: dataToUse.regularCost ? parseFloat(dataToUse.regularCost) : null,
          promoEndDate: dataToUse.isPromo ? dataToUse.nextPayment : dataToUse.promoEndDate,
        };
        
        await updateSubscriptionInDB(updatedSubscription);
        setSubscriptions(subscriptions.map(sub => 
          sub.id === editingSubscription.id ? updatedSubscription : sub
        ));
        
        setNewSubscription({
          name: '', currentCost: '', regularCost: '', billingCycle: 'monthly',
          nextPayment: '', category: 'entertainment', isPromo: false, promoEndDate: ''
        });
        setEditingSubscription(null);
        setShowAddForm(false);
      } catch (error) {
        console.error('Error updating subscription:', error);
      }
    }
  };

  const deleteSubscription = async (id) => {
    try {
      await deleteSubscriptionFromDB(id);
      setSubscriptions(subscriptions.filter(sub => sub.id !== id));
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const confirmDelete = async () => {
    if (subscriptionToDelete) {
      await deleteSubscription(subscriptionToDelete.id);
      setShowDeleteConfirm(false);
      setSubscriptionToDelete(null);
    }
  };

  // =============================================
  // EXPENSE FUNCTIONS (existing)
  // =============================================
  const addExpenseFunction = async (expenseData) => {
    const dataToUse = expenseData || newExpense;
    
    if (dataToUse.name && dataToUse.amount && dataToUse.nextDue) {
      try {
        const expense = {
          ...dataToUse,
          id: Date.now(),
          amount: parseFloat(dataToUse.amount) || 0,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addExpense(expense);
        setExpenses([...expenses, expense]);
        
        setNewExpense({
          name: '',
          amount: '',
          category: 'housing',
          nextDue: '',
          description: ''
        });
        setShowExpenseForm(false);
      } catch (error) {
        console.error('Error adding expense:', error);
        alert('Error adding expense: ' + error.message);
      }
    }
  };

  const updateExpenseFunction = async (expenseData) => {
    const dataToUse = expenseData || newExpense;
    
    if (dataToUse.name && dataToUse.amount && dataToUse.nextDue && editingExpense) {
      try {
        const updatedExpense = {
          ...editingExpense,
          ...dataToUse,
          amount: parseFloat(dataToUse.amount) || 0
        };
        
        await updateExpense(updatedExpense);
        setExpenses(expenses.map(exp => 
          exp.id === editingExpense.id ? updatedExpense : exp
        ));
        
        setNewExpense({
          name: '',
          amount: '',
          category: 'housing',
          nextDue: '',
          description: ''
        });
        setEditingExpense(null);
        setShowExpenseForm(false);
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    }
  };

  const deleteExpenseFunction = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const confirmDeleteExpense = async () => {
    if (expenseToDelete) {
      await deleteExpenseFunction(expenseToDelete.id);
      setShowDeleteExpenseConfirm(false);
      setExpenseToDelete(null);
    }
  };

  // =============================================
  // BNPL FUNCTIONS (new)
  // =============================================
  const addBNPLFunction = async (bnplData) => {
    const dataToUse = bnplData || newBNPL;
    
    if (dataToUse.itemName && dataToUse.totalAmount && dataToUse.nextPaymentDate) {
      try {
        const bnplItem = {
          ...dataToUse,
          id: Date.now(),
          totalAmount: parseFloat(dataToUse.totalAmount) || 0,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addBNPLItem(bnplItem);
        setBNPLItems([...bnplItems, bnplItem]);
        
        setNewBNPL({
          itemName: '',
          totalAmount: '',
          platform: 'grab',
          nextPaymentDate: '',
          description: ''
        });
        setShowBNPLForm(false);
      } catch (error) {
        console.error('Error adding BNPL item:', error);
        alert('Error adding BNPL item: ' + error.message);
      }
    }
  };

  const updateBNPLFunction = async (bnplData) => {
    const dataToUse = bnplData || newBNPL;
    
    if (dataToUse.itemName && dataToUse.totalAmount && dataToUse.nextPaymentDate && editingBNPL) {
      try {
        const updatedBNPL = {
          ...editingBNPL,
          ...dataToUse,
          totalAmount: parseFloat(dataToUse.totalAmount) || 0
        };
        
        await updateBNPLItem(updatedBNPL);
        setBNPLItems(bnplItems.map(item => 
          item.id === editingBNPL.id ? updatedBNPL : item
        ));
        
        setNewBNPL({
          itemName: '',
          totalAmount: '',
          platform: 'grab',
          nextPaymentDate: '',
          description: ''
        });
        setEditingBNPL(null);
        setShowBNPLForm(false);
      } catch (error) {
        console.error('Error updating BNPL item:', error);
      }
    }
  };

  const deleteBNPLFunction = async (id) => {
    try {
      await deleteBNPLItem(id);
      setBNPLItems(bnplItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting BNPL item:', error);
    }
  };

  const confirmDeleteBNPL = async () => {
    if (bnplToDelete) {
      await deleteBNPLFunction(bnplToDelete.id);
      setShowDeleteBNPLConfirm(false);
      setBNPLToDelete(null);
    }
  };

  // =============================================
  // UTILITY FUNCTIONS
  // =============================================
  const getDaysUntilPayment = (nextPayment) => {
    const today = new Date();
    const paymentDate = new Date(nextPayment);
    const diffTime = paymentDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTotalFunds = () => accounts.checking + accounts.savings;
  
  const getTotalMonthlyExpenses = () => {
    const subscriptionTotal = subscriptions.reduce((sum, sub) => {
      const cost = sub.currentCost || sub.cost || 0;
      return sum + (sub.billingCycle === 'yearly' ? cost / 12 : cost);
    }, 0);
    
    const expenseTotal = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const bnplTotal = bnplItems.reduce((sum, bnpl) => sum + (bnpl.totalAmount || 0), 0);
    
    return subscriptionTotal + expenseTotal + bnplTotal;
  };

  const updateAccountBalance = async (accountType, amount) => {
    const updatedAccounts = {
      ...accounts,
      [accountType]: parseFloat(amount)
    };
    setAccounts(updatedAccounts);
    await updateAccounts(updatedAccounts);
  };

  // =============================================
  // UI COMPONENTS
  // =============================================
  const Header = () => (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
            <DollarSign className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SubLog</h1>
            <p className="text-sm text-gray-600">Personal Finance Tracker</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBalanceVisible(!balanceVisible)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg"
          >
            {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
    </header>
  );

  const NavBar = () => (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around py-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Overview' },
            { id: 'expenses', icon: CreditCard, label: 'Expenses' },
            { id: 'subscriptions', icon: Smartphone, label: 'Subs' },
            { id: 'bnpl', icon: ShoppingCart, label: 'BNPL' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center py-1 px-3 rounded-lg transition-colors ${
                currentPage === id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );

  const getAddButtonAction = () => {
    switch (currentPage) {
      case 'expenses': return () => setShowExpenseForm(true);
      case 'subscriptions': return () => setShowAddForm(true);
      case 'bnpl': return () => setShowBNPLForm(true);
      case 'dashboard': return () => setShowAddForm(true); // Default to subscription on dashboard
      default: return () => setShowAddForm(true);
    }
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
            accounts={accounts}
            subscriptions={subscriptions}
            expenses={expenses}
            bnplItems={bnplItems}
            totalFunds={getTotalFunds()}
            totalMonthlyExpenses={getTotalMonthlyExpenses()}
            updateAccountBalance={updateAccountBalance}
            setCurrentPage={setCurrentPage}
            setShowAddForm={setShowAddForm}
            setShowExpenseForm={setShowExpenseForm}
            setShowBNPLForm={setShowBNPLForm}
          />
        );
      case 'subscriptions':
        return (
          <SubscriptionsPage
            {...commonProps}
            subscriptions={subscriptions}
            setShowAddForm={setShowAddForm}
            setEditingSubscription={setEditingSubscription}
            setShowDeleteConfirm={setShowDeleteConfirm}
            setSubscriptionToDelete={setSubscriptionToDelete}
          />
        );
      case 'expenses':
        return (
          <ExpensesPage
            {...commonProps}
            expenses={expenses}
            setShowExpenseForm={setShowExpenseForm}
            setEditingExpense={setEditingExpense}
            setShowDeleteConfirm={setShowDeleteExpenseConfirm}
            setExpenseToDelete={setExpenseToDelete}
          />
        );
      case 'bnpl':
        return (
          <BNPLPage
            {...commonProps}
            bnplItems={bnplItems}
            setShowBNPLForm={setShowBNPLForm}
            setEditingBNPL={setEditingBNPL}
            setShowDeleteConfirm={setShowDeleteBNPLConfirm}
            setBNPLToDelete={setBNPLToDelete}
          />
        );
      default:
        return <Dashboard {...commonProps} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pb-16">
        {renderCurrentPage()}
      </main>

      <NavBar />

      {/* Context-aware floating add button */}
      {!showAddForm && !showExpenseForm && !showBNPLForm && currentPage !== 'dashboard' && (
        <button
          onClick={getAddButtonAction()}
          className="fixed bottom-20 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center hover:scale-110"
        >
          <Plus size={24} />
        </button>
      )}

      {/* SUBSCRIPTION MODALS */}
      <AddSubscriptionModal 
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newSubscription={newSubscription}
        setNewSubscription={setNewSubscription}
        addSubscription={addSubscription}
        editingSubscription={editingSubscription}
        setEditingSubscription={setEditingSubscription}
        updateSubscription={updateSubscription}
      />

      <DeleteConfirmModal 
        showDeleteConfirm={showDeleteConfirm}
        setShowDeleteConfirm={setShowDeleteConfirm}
        subscriptionToDelete={subscriptionToDelete}
        confirmDelete={confirmDelete}
      />

      {/* EXPENSE MODALS */}
      <AddExpenseModal 
        showExpenseForm={showExpenseForm}
        setShowExpenseForm={setShowExpenseForm}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        addExpense={addExpenseFunction}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
        updateExpense={updateExpenseFunction}
      />

      <DeleteExpenseModal 
        showDeleteConfirm={showDeleteExpenseConfirm}
        setShowDeleteConfirm={setShowDeleteExpenseConfirm}
        expenseToDelete={expenseToDelete}
        confirmDelete={confirmDeleteExpense}
      />

      {/* BNPL MODALS */}
      <AddBNPLModal 
        showBNPLForm={showBNPLForm}
        setShowBNPLForm={setShowBNPLForm}
        newBNPL={newBNPL}
        setNewBNPL={setNewBNPL}
        addBNPL={addBNPLFunction}
        editingBNPL={editingBNPL}
        setEditingBNPL={setEditingBNPL}
        updateBNPL={updateBNPLFunction}
      />

      <DeleteBNPLModal 
        showDeleteConfirm={showDeleteBNPLConfirm}
        setShowDeleteConfirm={setShowDeleteBNPLConfirm}
        bnplToDelete={bnplToDelete}
        confirmDelete={confirmDeleteBNPL}
      />
    </div>
  );
}

export default App;