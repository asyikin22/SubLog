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
  
  // Updated state structure to match the new modal
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

  const addSubscription = async (subscriptionData) => {
    console.log('addSubscription called with:', subscriptionData);
    
    // Use subscriptionData if provided (from modal), otherwise use newSubscription state
    const dataToUse = subscriptionData || newSubscription;
    
    if (dataToUse.name && (dataToUse.currentCost || dataToUse.currentCost === '0') && dataToUse.nextPayment) {
      try {
        const subscription = {
          ...dataToUse,
          id: Date.now(),
          cost: parseFloat(dataToUse.currentCost) || 0, // Main cost field for backward compatibility
          currentCost: parseFloat(dataToUse.currentCost) || 0,
          regularCost: dataToUse.regularCost ? parseFloat(dataToUse.regularCost) : null,
          // If it's a promo, use nextPayment as the promoEndDate
          promoEndDate: dataToUse.isPromo ? dataToUse.nextPayment : dataToUse.promoEndDate,
          addedDate: new Date().toISOString().split('T')[0]
        };
        
        console.log('Adding subscription:', subscription);
        await addSubscriptionToDB(subscription);
        setSubscriptions([...subscriptions, subscription]);
        
        // Reset form
        setNewSubscription({
          name: '',
          currentCost: '',
          regularCost: '',
          billingCycle: 'monthly',
          nextPayment: '',
          category: 'entertainment',
          isPromo: false,
          promoEndDate: ''
        });
        setShowAddForm(false);
        console.log('Subscription added successfully!');
      } catch (error) {
        console.error('Error adding subscription:', error);
        alert('Error adding subscription: ' + error.message);
      }
    } else {
      console.error('Missing required fields:', {
        name: dataToUse.name,
        currentCost: dataToUse.currentCost,
        nextPayment: dataToUse.nextPayment
      });
      alert('Please fill in all required fields (name, cost, next payment date)');
    }
  };

  const updateSubscription = async (subscriptionData) => {
    console.log('updateSubscription called with:', subscriptionData);
    
    // Use subscriptionData if provided (from modal), otherwise use newSubscription state
    const dataToUse = subscriptionData || newSubscription;
    
    if (dataToUse.name && (dataToUse.currentCost || dataToUse.currentCost === '0') && dataToUse.nextPayment && editingSubscription) {
      try {
        const updatedSubscription = {
          ...editingSubscription,
          ...dataToUse,
          cost: parseFloat(dataToUse.currentCost) || 0, // Main cost field for backward compatibility
          currentCost: parseFloat(dataToUse.currentCost) || 0,
          regularCost: dataToUse.regularCost ? parseFloat(dataToUse.regularCost) : null,
          // If it's a promo, use nextPayment as the promoEndDate
          promoEndDate: dataToUse.isPromo ? dataToUse.nextPayment : dataToUse.promoEndDate,
        };
        
        console.log('Updating subscription:', updatedSubscription);
        await updateSubscriptionInDB(updatedSubscription);
        setSubscriptions(subscriptions.map(sub => 
          sub.id === editingSubscription.id ? updatedSubscription : sub
        ));
        
        // Reset form
        setNewSubscription({
          name: '',
          currentCost: '',
          regularCost: '',
          billingCycle: 'monthly',
          nextPayment: '',
          category: 'entertainment',
          isPromo: false,
          promoEndDate: ''
        });
        setEditingSubscription(null);
        setShowAddForm(false);
        console.log('Subscription updated successfully!');
      } catch (error) {
        console.error('Error updating subscription:', error);
        alert('Error updating subscription: ' + error.message);
      }
    } else {
      console.error('Missing required fields for update');
      alert('Please fill in all required fields');
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
      // Use currentCost if available, otherwise use cost for backward compatibility
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