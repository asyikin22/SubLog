// components/layout/Header.jsx
import React, { useState } from 'react';
import { DollarSign, Eye, EyeOff, Calendar } from 'lucide-react';
import CalendarModal from '../common/CalendarModal';

const Header = ({ 
  balanceVisible, 
  setBalanceVisible, 
  subscriptions = [], 
  expenses = [], 
  bnplItems = [] 
}) => {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleCalendarClick = () => {
    setShowCalendar(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
              <DollarSign className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">MoneyTracker</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCalendarClick}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
              title="View payment calendar"
            >
              <Calendar size={20} />
            </button>
            
            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
              title={balanceVisible ? "Hide balances" : "Show balances"}
            >
              {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Calendar Modal */}
      <CalendarModal
        showCalendar={showCalendar}
        setShowCalendar={setShowCalendar}
        subscriptions={subscriptions}
        expenses={expenses}
        bnplItems={bnplItems}
      />
    </>
  );
};

export default Header;