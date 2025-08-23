import { formatCurrency } from '../utils/storage';

const SummaryCards = ({ totalMonthlyCost, subscriptionsCount, upcomingPaymentsCount }) => {
  return (
    <div className="flex gap-2 md:gap-4">
      <div className="flex-[1.1] bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div>
            <p className="text-xs md:text-sm text-gray-600">Monthly Total</p>
            <p className="text-lg md:text-2xl font-bold text-gray-800">{formatCurrency(totalMonthlyCost)}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div>
            <p className="text-xs md:text-sm text-gray-600">Active Subs</p>
            <p className="text-lg md:text-2xl font-bold text-gray-800">{subscriptionsCount}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl p-3 md:p-6 shadow-sm border border-gray-100">
        <div className="text-center">
          <div>
            <p className="text-xs md:text-sm text-gray-600">Due This Week</p>
            <p className="text-lg md:text-2xl font-bold text-gray-800">{upcomingPaymentsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;