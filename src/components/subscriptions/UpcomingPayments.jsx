import { Bell } from 'lucide-react';
import { formatCurrency } from '../utils/storage';

const UpcomingPayments = ({ upcomingPayments }) => {
  if (upcomingPayments.length === 0) return null;

  // Check if there are urgent payments (today or overdue)
  const hasUrgentPayments = upcomingPayments.some(sub => sub.daysUntil <= 0);

  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-2">
      <div className="flex items-center space-x-2 mb-1">
        <Bell 
          className={`text-red-600 ${hasUrgentPayments ? 'animate-bounce' : 'animate-pulse'}`} 
          size={18} 
        />
        <h3 className="font-semibold text-red-800 text-sm">Upcoming Payments</h3>
      </div>
      <div className="space-y-1">
        {upcomingPayments.map(sub => (
          <div key={sub.id} className="flex items-center justify-between text-xs rounded-lg p-1">
            <span className="font-medium text-gray-800">{sub.name}</span>
            <div className="flex items-center space-x-1">
              <span className="text-gray-600 text-xs">{formatCurrency(sub.cost)}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                sub.daysUntil === 0 ? 'bg-red-200 text-red-900 animate-pulse' :
                sub.daysUntil <= 2 ? 'bg-red-200 text-red-900' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {sub.daysUntil === 0 ? 'Due Today!' : `${sub.daysUntil} days`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingPayments;