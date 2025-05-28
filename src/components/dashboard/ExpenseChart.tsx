import React from 'react';
import { useExpenses } from '../../context/ExpenseContext';
import Card, { CardHeader, CardContent } from '../ui/Card';
import { groupExpensesByCategory } from '../../utils/helpers';

const RADIUS = 80;
const CENTER = 100;

const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
};

const describeArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${x} ${y}`, // Move to center
    `L ${start.x} ${start.y}`, // Line to start point
    `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`, // Arc
    'Z' // Close path
  ].join(' ');
};

const ExpenseChart: React.FC = () => {
  const { expenses, categories } = useExpenses();

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-800">Expenses by Category</h2>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const categoryExpenses = groupExpensesByCategory(expenses);
  const total = Object.values(categoryExpenses).reduce((sum, val) => sum + val, 0);

  let startAngle = 0;
  const paths = Object.entries(categoryExpenses).map(([category, amount], index) => {
    const percent = amount / total;
    const angle = percent * 360;
    const endAngle = startAngle + angle;

    const color = categories.find(c => c.name === category)?.color || '#6B7280';
    const d = describeArc(CENTER, CENTER, RADIUS, startAngle, endAngle);

    startAngle = endAngle;

    return (
      <path key={index} d={d} fill={color} />
    );
  });

  const legend = Object.entries(categoryExpenses).map(([category, amount], index) => {
    const percentage = ((amount / total) * 100).toFixed(1);
    const color = categories.find(cat => cat.name === category)?.color || '#6B7280';

    return (
      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
        <div className="w-3 h-3" style={{ backgroundColor: color }} />
        <span>{category} ({percentage}%)</span>
      </div>
    );
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-gray-800">Expenses by Category</h2>
      </CardHeader>
      <CardContent>
        <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto">
          {paths}
        </svg>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {legend}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;
