import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Budget } from '../../types';

interface BudgetFormProps {
  budget?: Budget;
  onSubmit: () => void;
  onCancel: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ 
  budget, 
  onSubmit, 
  onCancel 
}) => {
  const { categories, addBudget, updateBudget } = useExpenses();
  
  const [amount, setAmount] = useState(budget ? budget.amount.toString() : '');
  const [category, setCategory] = useState(budget ? budget.category : categories[0]?.name || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const budgetData = {
      amount: parseFloat(amount),
      category,
    };
    
    if (budget) {
      updateBudget({ ...budgetData, id: budget.id });
    } else {
      addBudget(budgetData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>
      
      <Input
        type="number"
        label="Budget Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0"
        error={errors.amount}
        required
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {budget ? 'Update Budget' : 'Add Budget'}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;