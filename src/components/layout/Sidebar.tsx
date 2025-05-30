import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, Settings, Tag, CreditCard } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { id: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: '/dashboard/expenses', label: 'Expenses', icon: <Receipt size={20} /> },
    { id: '/dashboard/categories', label: 'Categories', icon: <Tag size={20} /> },
    { id: '/dashboard/budgets', label: 'Budgets', icon: <CreditCard size={20} /> },
    { id: '/dashboard/reports', label: 'Reports', icon: <PieChart size={20} /> },
    { id: '/dashboard/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 h-full w-64 bg-gray-800 text-white pt-16 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-6">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
                      location.pathname === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 lg:hidden">
        <nav className="flex justify-around">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`flex flex-col items-center py-2 px-3 ${
                location.pathname === item.id
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;