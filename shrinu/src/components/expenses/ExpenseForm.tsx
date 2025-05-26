import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Expense } from '../../types';

interface ExpenseFormProps {
  expense?: Expense;
  onSubmit: () => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ 
  expense, 
  onSubmit, 
  onCancel 
}) => {
  const { categories, addExpense, updateExpense, balance } = useExpenses();
  
  const [amount, setAmount] = useState(expense ? expense.amount.toString() : '');
  const [description, setDescription] = useState(expense ? expense.description : '');
  const [category, setCategory] = useState(expense ? expense.category : categories[0]?.name || '');
  const [date, setDate] = useState(expense ? expense.date.substring(0, 10) : new Date().toISOString().substring(0, 10));
  const [purpose, setPurpose] = useState(expense ? expense.purpose : '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    } else if (Number(amount) > balance.total && !expense) {
      newErrors.amount = 'Amount exceeds available balance';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const expenseData = {
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date).toISOString(),
      purpose,
    };
    
    if (expense) {
      updateExpense({ ...expenseData, id: expense.id });
    } else {
      addExpense(expenseData);
    }
    
    onSubmit();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="number"
        label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        step="0.01"
        min="0"
        error={errors.amount}
        required
      />
      
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What was this expense for?"
        error={errors.description}
        required
      />
      
      <Input
        label="Purpose"
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
        placeholder="Why did you make this expense?"
        error={errors.purpose}
        required
      />
      
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
        type="date"
        label="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        error={errors.date}
        required
      />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {expense ? 'Update Expense' : 'Add Expense'}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;