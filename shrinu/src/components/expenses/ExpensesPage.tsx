import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Plus, X } from 'lucide-react';

const ExpensesPage: React.FC = () => {
  const { expenses } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  
  const handleAddClick = () => {
    setEditingExpenseId(null);
    setShowForm(true);
  };
  
  const handleEditClick = (id: string) => {
    setEditingExpenseId(id);
    setShowForm(true);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingExpenseId(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpenseId(null);
  };
  
  const editingExpense = editingExpenseId 
    ? expenses.find(expense => expense.id === editingExpenseId) 
    : undefined;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <Button 
          onClick={handleAddClick}
          variant="primary"
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Expense
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
            <button 
              onClick={handleFormCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              expense={editingExpense}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </CardContent>
        </Card>
      )}
      
      <ExpenseList onEdit={handleEditClick} />
    </div>
  );
};

export default ExpensesPage;