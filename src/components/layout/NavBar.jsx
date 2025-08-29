// components/layout/NavBar.jsx
import React from 'react';
import { LayoutDashboard, Home, Bot, Smartphone, ShoppingCart, User, Heart } from 'lucide-react';

const NavBar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'expenses', icon: Home, label: 'Fixed' },
    { id: 'subscriptions', icon: Bot, label: 'Subs' },
    { id: 'bnpl', icon: ShoppingCart, label: 'BNPL' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
    { id: 'accounts', icon: User, label: 'Account' }
  ];

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-around py-2">
          {navItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
                currentPage === id
                  ? id === 'wishlist' 
                    ? 'text-pink-600 bg-pink-50'
                    : 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={18} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;