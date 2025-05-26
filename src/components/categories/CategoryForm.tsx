import React, { useState, useEffect } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Category } from '../../types';

interface CategoryFormProps {
  category?: Category;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category, 
  onSubmit, 
  onCancel 
}) => {
  const { addCategory, updateCategory } = useExpenses();
  
  const [name, setName] = useState(category ? category.name : '');
  const [color, setColor] = useState(category ? category.color : '#3B82F6');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!color) {
      newErrors.color = 'Please select a color';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const categoryData = {
      name,
      color,
    };
    
    if (category) {
      updateCategory({ ...categoryData, id: category.id });
    } else {
      addCategory(categoryData);
    }
    
    onSubmit();
  };
  
  // Predefined colors
  const colorOptions = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Category Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Groceries, Rent, etc."
        error={errors.name}
        required
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Color
        </label>
        <div className="flex space-x-2 mb-2">
          {colorOptions.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`h-8 w-8 rounded-full border-2 ${
                color === colorOption ? 'border-gray-900' : 'border-transparent'
              }`}
              style={{ backgroundColor: colorOption }}
              onClick={() => setColor(colorOption)}
            />
          ))}
        </div>
        <div className="flex items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10 border-0 p-0"
          />
          <span className="ml-2 text-sm text-gray-500">
            Or pick a custom color
          </span>
        </div>
        {errors.color && (
          <p className="mt-1 text-sm text-red-600">{errors.color}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {category ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;