import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { formatCurrency, groupExpensesByCategory, filterExpensesByMonth } from '../../utils/helpers';
import { BarChartBig, CircleSlash } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const filteredExpenses = filterExpensesByMonth(expenses, selectedMonth, selectedYear);
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryExpenses = groupExpensesByCategory(filteredExpenses);
  
  const getCategoryColor = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#6B7280'; // Default gray
  };
  
  // Get sorted categories by amount (descending)
  const sortedCategories = Object.entries(categoryExpenses)
    .sort(([, amountA], [, amountB]) => amountB - amountA);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Expenses by Category</h2>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <CircleSlash size={48} className="mb-2 text-gray-300" />
                <p>No data for the selected period</p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Expenses:</span>
                  <span className="font-semibold text-lg">{formatCurrency(totalExpenses)}</span>
                </div>
                {sortedCategories.map(([categoryName, amount]) => {
                  const percentage = (amount / totalExpenses) * 100;
                  
                  return (
                    <div key={categoryName} className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: getCategoryColor(categoryName) }}
                          ></div>
                          <span className="text-sm font-medium">{categoryName}</span>
                        </div>
                        <div className="text-sm font-medium">
                          {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: getCategoryColor(categoryName)
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Monthly Comparison</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48">
              <BarChartBig size={64} className="text-gray-300" />
            </div>
            <p className="text-center text-gray-500">
              Monthly comparison will be available once you have data for multiple months
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;