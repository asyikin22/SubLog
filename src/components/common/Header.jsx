import { DollarSign, Settings } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500 w-10 h-10 rounded-full flex items-center justify-center">
            <DollarSign className="text-white text-lg" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">SubLog</h1>
            <p className="text-sm text-gray-600">Track your subscriptions</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Settings size={20} />
        </div>
      </div>
    </header>
  );
};

export default Header;