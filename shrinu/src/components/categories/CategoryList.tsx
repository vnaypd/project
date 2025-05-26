import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Button from '../ui/Button';
import { Edit, Trash2 } from 'lucide-react';

interface CategoryListProps {
  onEdit: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onEdit }) => {
  const { categories, deleteCategory } = useExpenses();
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Color
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div 
                  className="h-6 w-6 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => onEdit(category.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryList;