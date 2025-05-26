import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { formatCurrency, formatDate } from '../../utils/helpers';

const RecentExpenses: React.FC = () => {
  const { expenses, categories } = useExpenses();
  
  // Sort expenses by date (newest first) and take the 5 most recent
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#6B7280'; // Default gray
  };
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-800">Recent Expenses</h2>
      </CardHeader>
      <CardContent>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No expenses yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentExpenses.map((expense) => (
              <li key={expense.id} className="py-3 flex justify-between items-center group hover:bg-gray-50 rounded-md px-2 transition-colors">
                <div className="flex items-center">
                  <div 
                    className="h-8 w-8 rounded-full flex items-center justify-center mr-3" 
                    style={{ backgroundColor: getCategoryColor(expense.category) + '33' }}
                  >
                    <div 
                      className="h-2 w-2 rounded-full" 
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    ></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{expense.description}</p>
                    <p className="text-sm text-gray-500">{expense.category} • {formatDate(expense.date)}</p>
                  </div>
                </div>
                <span className="font-medium text-gray-900">{formatCurrency(expense.amount)}</span>
              </li>
            ))}
          </ul>
        )}
        {expenses.length > 5 && (
          <div className="mt-4 text-center">
            <button 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => {/* Navigate to expenses page */}}
            >
              View all expenses
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentExpenses;