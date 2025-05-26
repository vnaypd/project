import React from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Save, AlertTriangle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Profile Settings</h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input
                label="Display Name"
                defaultValue="User"
                placeholder="Your name"
              />
              
              <Input
                type="email"
                label="Email Address"
                defaultValue="user@example.com"
                placeholder="your.email@example.com"
              />
              
              <div className="pt-2">
                <Button type="submit" variant="primary" className="flex items-center">
                  <Save size={18} className="mr-1" />
                  Save Profile
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Currency Settings</h2>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  defaultValue="USD"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="JPY">Japanese Yen (¥)</option>
                  <option value="CAD">Canadian Dollar (C$)</option>
                </select>
              </div>
              
              <div className="pt-2">
                <Button type="submit" variant="primary" className="flex items-center">
                  <Save size={18} className="mr-1" />
                  Save Currency
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-red-50 border border-red-200">
        <CardHeader>
          <div className="flex items-center text-red-700">
            <AlertTriangle size={20} className="mr-2" />
            <h2 className="text-lg font-semibold">Danger Zone</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            The following actions are destructive and cannot be undone. Please proceed with caution.
          </p>
          <Button type="button" variant="danger">
            Reset All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;