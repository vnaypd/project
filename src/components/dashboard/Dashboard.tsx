import React from 'react';
import ExpenseSummary from './ExpenseSummary';
import RecentExpenses from './RecentExpenses';
import ExpenseChart from './ExpenseChart';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <ExpenseSummary />
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ExpenseChart />
        <RecentExpenses />
      </div>
    </div>
  );
};

export default Dashboard;