import React, { useEffect, useRef } from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { groupExpensesByCategory } from '../../utils/helpers';

const ExpenseChart: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const chartRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartRef.current || expenses.length === 0) return;
    
    const categoryExpenses = groupExpensesByCategory(expenses);
    const totalExpenses = Object.values(categoryExpenses).reduce((sum, amount) => sum + amount, 0);
    
    // Clear previous chart
    chartRef.current.innerHTML = '';
    
    // Create simple donut chart using divs
    const chart = document.createElement('div');
    chart.className = 'relative h-48 w-48 mx-auto';
    
    let cumulativePercentage = 0;
    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      const percentage = (amount / totalExpenses) * 100;
      const categoryColor = categories.find(cat => cat.name === category)?.color || '#6B7280';
      
      const segment = document.createElement('div');
      segment.className = 'absolute inset-0 overflow-hidden';
      segment.style.clipPath = `polygon(50% 50%, 50% 0%, ${getCoordinatesForPercentage(cumulativePercentage + percentage)})`;
      segment.style.transform = `rotate(${cumulativePercentage * 3.6}deg)`;
      
      const segmentInner = document.createElement('div');
      segmentInner.className = 'absolute inset-0';
      segmentInner.style.backgroundColor = categoryColor;
      segmentInner.style.clipPath = 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)';
      
      segment.appendChild(segmentInner);
      chart.appendChild(segment);
      
      cumulativePercentage += percentage;
    });
    
    // Add center circle for donut effect
    const centerCircle = document.createElement('div');
    centerCircle.className = 'absolute rounded-full bg-white';
    centerCircle.style.width = '60%';
    centerCircle.style.height = '60%';
    centerCircle.style.top = '20%';
    centerCircle.style.left = '20%';
    chart.appendChild(centerCircle);
    
    chartRef.current.appendChild(chart);
    
    // Create legend
    const legend = document.createElement('div');
    legend.className = 'grid grid-cols-2 gap-2 mt-4';
    
    Object.entries(categoryExpenses).forEach(([category, amount]) => {
      const percentage = ((amount / totalExpenses) * 100).toFixed(1);
      const categoryColor = categories.find(cat => cat.name === category)?.color || '#6B7280';
      
      const legendItem = document.createElement('div');
      legendItem.className = 'flex items-center';
      
      const colorBox = document.createElement('div');
      colorBox.className = 'w-3 h-3 mr-2';
      colorBox.style.backgroundColor = categoryColor;
      
      const label = document.createElement('span');
      label.className = 'text-xs text-gray-600';
      label.textContent = `${category} (${percentage}%)`;
      
      legendItem.appendChild(colorBox);
      legendItem.appendChild(label);
      legend.appendChild(legendItem);
    });
    
    chartRef.current.appendChild(legend);
    
  }, [expenses, categories]);
  
  // Helper function to get coordinates for pie chart segments
  const getCoordinatesForPercentage = (percentage: number) => {
    const x = Math.cos(2 * Math.PI * (percentage / 100));
    const y = Math.sin(2 * Math.PI * (percentage / 100));
    return `${50 + 50 * x}% ${50 + 50 * y}%`;
  };
  
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-800">Expenses by Category</h2>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No data available</p>
        ) : (
          <div ref={chartRef} className="py-2"></div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;