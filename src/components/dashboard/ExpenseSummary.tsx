import React from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { formatCurrency, getTotalExpenses, groupExpensesByCategory } from '../../utils/helpers';
import { useExpenses } from '../../context/ExpenseContext';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Plus } from 'lucide-react';
import Button from '../ui/Button';

const ExpenseSummary: React.FC = () => {
  const { expenses, budgets, balance, addBalance } = useExpenses();
  const [showAddBalance, setShowAddBalance] = React.useState(false);
  const [amount, setAmount] = React.useState('');
  const [description, setDescription] = React.useState('');
  
  const totalExpenses = getTotalExpenses(expenses);
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const percentUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;
  
  const handleAddBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      addBalance(numAmount, description);
      setAmount('');
      setDescription('');
      setShowAddBalance(false);
    }
  };
  
  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="flex items-center p-6">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="mb-2 text-sm font-medium text-gray-600">Current Balance</p>
            <p className="text-lg font-semibold text-gray-700">{formatCurrency(balance.total)}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddBalance(!showAddBalance)}
            className="ml-4"
          >
            <Plus size={16} />
          </Button>
        </CardContent>
        {showAddBalance && (
          <CardContent className="border-t">
            <form onSubmit={handleAddBalance} className="space-y-3">
              <div>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full px-3 py-2 border rounded-md"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description (optional)"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddBalance(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Add
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>
      
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="flex items-center p-6">
          <div className="p-3 rounded-full bg-blue-100 mr-4">
            <ArrowDownCircle className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-lg font-semibold text-gray-700">{formatCurrency(totalExpenses)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="flex items-center p-6">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <ArrowUpCircle className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Total Budget</p>
            <p className="text-lg font-semibold text-gray-700">{formatCurrency(totalBudget)}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="transform transition-transform hover:scale-105">
        <CardContent className="flex flex-col p-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">Budget Used</p>
            <p className="text-sm font-medium text-gray-600">{percentUsed.toFixed(0)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                percentUsed > 90 ? 'bg-red-600' : 
                percentUsed > 75 ? 'bg-yellow-500' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(percentUsed, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseSummary;