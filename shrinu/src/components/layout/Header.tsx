import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center ml-4 lg:ml-0">
            <h1 className="text-xl font-bold text-gray-900">ExpenseTracker</h1>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Bell size={20} />
          </button>
          <div className="border-l border-gray-300 h-6 mx-2"></div>
          <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;