import React, { useState } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import CategoryList from './CategoryList';
import CategoryForm from './CategoryForm';
import Button from '../ui/Button';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { Plus, X } from 'lucide-react';

const CategoriesPage: React.FC = () => {
  const { categories } = useExpenses();
  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  
  const handleAddClick = () => {
    setEditingCategoryId(null);
    setShowForm(true);
  };
  
  const handleEditClick = (id: string) => {
    setEditingCategoryId(id);
    setShowForm(true);
  };
  
  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingCategoryId(null);
  };
  
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategoryId(null);
  };
  
  const editingCategory = editingCategoryId 
    ? categories.find(category => category.id === editingCategoryId) 
    : undefined;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button 
          onClick={handleAddClick}
          variant="primary"
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Add Category
        </Button>
      </div>
      
      {showForm && (
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <button 
              onClick={handleFormCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={editingCategory}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </CardContent>
        </Card>
      )}
      
      <CategoryList onEdit={handleEditClick} />
    </div>
  );
};

export default CategoriesPage;