// components/common/CalendarModal.jsx
import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/storage';

const CalendarModal = ({ 
  showCalendar, 
  setShowCalendar, 
  subscriptions = [], 
  expenses = [], 
  bnplItems = [] 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Memoize payment data to prevent recalculating on every render
  const paymentData = useMemo(() => {
    const payments = [];
    subscriptions.forEach(sub => {
      if (sub.nextPayment) {
        payments.push({ date: sub.nextPayment, name: sub.name, amount: sub.currentCost || sub.cost });
      }
    });
    expenses.forEach(exp => {
      if (exp.nextDue) {
        payments.push({ date: exp.nextDue, name: exp.name, amount: exp.amount });
      }
    });
    bnplItems.forEach(bnpl => {
      if (bnpl.nextPaymentDate) {
        payments.push({ date: bnpl.nextPaymentDate, name: bnpl.itemName, amount: bnpl.totalAmount });
      }
    });
    return payments;
  }, [subscriptions, expenses, bnplItems]);

  // Memoize calendar days calculation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ day: null, isPadding: true });
    }
    
    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isPadding: false });
    }
    
    // Add empty cells to complete the grid (6 rows × 7 columns = 42 cells)
    while (days.length < 42) {
      days.push({ day: null, isPadding: true });
    }
    
    return days;
  }, [currentDate]);

  const getPaymentsForDate = (day) => {
    if (!day) return [];
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return paymentData.filter(payment => payment.date === dateString);
  };

  const previousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null); // Clear selection when changing months
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null); // Clear selection when changing months
  };

  const handleDateClick = (day) => {
    if (!day) return;
    const clickedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(selectedDate === clickedDate ? null : clickedDate);
  };

  const selectedPayments = selectedDate ? paymentData.filter(p => p.date === selectedDate) : [];

  if (!showCalendar) return null;

  return (
    <div 
      className="fixed inset-0 bg-blue-900/10 backdrop-blur-md flex items-center justify-center z-50 p-5"
      onClick={() => setShowCalendar(false)}
    >
      {/* Calendar Modal */}
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header with Legends inline */}
        <div className="py-1.5 px-4 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex gap-3 text-xs">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                Due Soon
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                Due Today
              </span>
            </div>
          <button onClick={() => setShowCalendar(false)} className="p-1 hover:bg-gray-200 rounded-lg">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={previousMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronLeft size={20} />
            </button>
            <h3 className="text-lg font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 text-center text-xs font-medium text-gray-500 mb-2">
            {daysOfWeek.map(day => <div key={day} className="p-2">{day}</div>)}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ day, isPadding }, index) => {
              const payments = getPaymentsForDate(day);
              const hasPayments = payments.length > 0;
              const dateString = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
              const isSelected = selectedDate === dateString;
              const isToday = day &&
                new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

              return (
                <button
                  key={`${currentDate.getMonth()}-${currentDate.getFullYear()}-${index}`}
                  onClick={() => handleDateClick(day)}
                  className={`
                    relative h-10 text-sm rounded-lg transition
                    ${isPadding ? 'invisible' : 'hover:bg-gray-100'}
                    ${isSelected ? 'bg-blue-500 text-white shadow-md' : ''}
                    ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                    ${hasPayments && !isSelected ? 'bg-red-50 text-red-600' : ''}
                  `}
                  disabled={isPadding}
                >
                  {day}
                  {hasPayments && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Popup */}
      {selectedDate && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDate(null);
            }}
          ></div>

          <div className="relative w-full max-w-xs bg-white rounded-xl shadow-2xl p-5 z-[70]">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Clock size={16} className="mr-2 text-blue-600" />
              {new Date(selectedDate).toLocaleDateString('en-MY', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </h4>

            {selectedPayments.length > 0 ? (
              <div className="space-y-3">
                {selectedPayments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-800">{p.name}</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No payments scheduled</p>
            )}

            <button 
              onClick={() => setSelectedDate(null)} 
              className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={18} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModal;