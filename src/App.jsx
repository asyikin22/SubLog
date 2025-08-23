import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

// Import components
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import UpcomingPayments from './components/UpcomingPayments';
import AddSubscriptionModal from './components/AddSubscriptionModal';
import SubscriptionList from './components/SubscriptionList';
import DeleteConfirmModal from './components/DeleteConfirmModal';

// Import storage utilities
import { 
  getSubscriptions, 
  saveSubscriptions, 
  addSubscription as addSubscriptionToDB, 
  updateSubscription as updateSubscriptionInDB,
  deleteSubscription as deleteSubscriptionFromDB 
} from './utils/storage';

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState(null);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    cost: '',
    billingCycle: 'monthly',
    nextPayment: '',
    category: 'entertainment'
  });

  // Load data from IndexedDB on component mount
  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const savedSubs = await getSubscriptions();
        setSubscriptions(savedSubs);
      } catch (error) {
        console.error('Error loading subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  // Save subscriptions to IndexedDB whenever they change
  useEffect(() => {
    if (!loading && subscriptions.length >= 0) {
      saveSubscriptions(subscriptions);
    }
  }, [subscriptions, loading]);

  const addSubscription = async () => {
    if (newSubscription.name && newSubscription.cost && newSubscription.nextPayment) {
      try {
        const subscription = {
          ...newSubscription,
          id: Date.now(),
          cost: parseFloat(newSubscription.cost),
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        await addSubscriptionToDB(subscription);
        setSubscriptions([...subscriptions, subscription]);
        setNewSubscription({
          name: '',
          cost: '',
          billingCycle: 'monthly',
          nextPayment: '',
          category: 'entertainment'
        });
        setShowAddForm(false);
      } catch (error) {
        console.error('Error adding subscription:', error);
      }
    }
  };

  
  const updateSubscription = async () => {
    if (newSubscription.name && newSubscription.cost && newSubscription.nextPayment && editingSubscription) {
      try {
        const updatedSubscription = {
          ...editingSubscription,
          ...newSubscription,
          cost: parseFloat(newSubscription.cost)
        };
        
        await updateSubscriptionInDB(updatedSubscription); // Use the correct function
        setSubscriptions(subscriptions.map(sub => 
          sub.id === editingSubscription.id ? updatedSubscription : sub
        ));
        
        setNewSubscription({
          name: '',
          cost: '',
          billingCycle: 'monthly',
          nextPayment: '',
          category: 'entertainment'
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

  const getDaysUntilPayment = (nextPayment) => {
    const today = new Date();
    const paymentDate = new Date(nextPayment);
    const diffTime = paymentDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTotalMonthlyCost = () => {
    return subscriptions.reduce((total, sub) => {
      const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
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

  const upcomingPayments = getUpcomingPayments();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
        <SummaryCards 
          totalMonthlyCost={getTotalMonthlyCost()}
          subscriptionsCount={subscriptions.length}
          upcomingPaymentsCount={upcomingPayments.length}
        />

        <UpcomingPayments upcomingPayments={upcomingPayments} />

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Subscriptions</h3>
          <SubscriptionList 
            subscriptions={subscriptions}
            deleteSubscription={deleteSubscription}
            getDaysUntilPayment={getDaysUntilPayment}
            setShowAddForm={setShowAddForm}
            setEditingSubscription={setEditingSubscription}
            setShowDeleteConfirm={setShowDeleteConfirm}
            setSubscriptionToDelete={setSubscriptionToDelete}
          />
        </div>
      </div>

      {/* Floating Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 bg-blue-500 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center hover:scale-110"
        >
          <Plus size={24} />
        </button>
      )}

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
    </div>
  );
}

export default App;