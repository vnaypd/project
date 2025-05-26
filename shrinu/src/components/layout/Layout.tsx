import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from '../dashboard/Dashboard';
import ExpensesPage from '../expenses/ExpensesPage';
import CategoriesPage from '../categories/CategoriesPage';
import BudgetsPage from '../budgets/BudgetsPage';
import ReportsPage from '../reports/ReportsPage';
import SettingsPage from '../settings/SettingsPage';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <ExpensesPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'budgets':
        return <BudgetsPage />;
      case 'reports':
        return <ReportsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar 
        isOpen={sidebarOpen} 
        setCurrentPage={setCurrentPage} 
        currentPage={currentPage} 
      />
      
      <main className="pt-16 pb-16 lg:pl-64">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default Layout;