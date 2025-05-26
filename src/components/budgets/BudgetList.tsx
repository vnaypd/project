import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import { formatCurrency, groupExpensesByCategory } from '../../utils/helpers';
import { Edit, Trash2 } from 'lucide-react';
import Card from '../ui/Card';

interface BudgetListProps {
  onEdit: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({ onEdit }) => {
  const { budgets, expenses, categories, deleteBudget } = useExpenses();
  
  // Get total spent by category
  const categoryExpenses = groupExpensesByCategory(expenses);
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#6B7280'; // Default gray
  };
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {budgets.length === 0 ? (
        <div className="md:col-span-2 lg:col-span-3 text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No budgets set yet</p>
        </div>
      ) : (
        budgets.map((budget) => {
          const spent = categoryExpenses[budget.category] || 0;
          const percentUsed = (spent / budget.amount) * 100;
          
          return (
            <Card key={budget.id} className="transform transition-transform hover:scale-105">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: getCategoryColor(budget.category) }}
                    ></div>
                    <h3 className="text-lg font-semibold text-gray-800">{budget.category}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => onEdit(budget.id)}
                      className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-blue-50"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteBudget(budget.id)}
                      className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Spent: {formatCurrency(spent)}
                  </span>
                  <span className="text-gray-600">
                    Budget: {formatCurrency(budget.amount)}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <div 
                    className={`h-2.5 rounded-full ${
                      percentUsed > 100 ? 'bg-red-600' : 
                      percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs">
                  <span 
                    className={`font-medium ${
                      percentUsed > 100 ? 'text-red-600' : 'text-gray-500'
                    }`}
                  >
                    {percentUsed.toFixed(0)}% used
                  </span>
                  <span className="text-gray-500">
                    {formatCurrency(Math.max(budget.amount - spent, 0))} remaining
                  </span>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default BudgetList;