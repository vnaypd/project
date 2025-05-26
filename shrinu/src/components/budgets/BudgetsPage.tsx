import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Plus, X } from 'lucide-react';

const BudgetsPage: React.FC = () => {
  const { budgets } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  
  const handleAddClick = () => {
    setEditingBudgetId(null);
    setShowForm(true);
  };
  
  const handleEditClick = (id: string) => {
    setEditingBudgetId(id);
    setShowForm(true);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingBudgetId(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingBudgetId(null);
  };
  
  const editingBudget = editingBudgetId 
    ? budgets.find(budget => budget.id === editingBudgetId) 
    : undefined;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
        <Button 
          onClick={handleAddClick}
          variant="primary"
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Budget
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h2>
            <button 
              onClick={handleFormCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent>
            <BudgetForm
              budget={editingBudget}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </CardContent>
        </Card>
      )}
      
      <BudgetList onEdit={handleEditClick} />
    </div>
  );
};

export default BudgetsPage;