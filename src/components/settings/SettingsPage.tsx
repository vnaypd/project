import React, { useState } from 'react';
import Card, { CardHeader, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Save, AlertTriangle, LogIn, LogOut } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import { useAuth } from '../../utils/AuthContext';

const SettingsPage: React.FC = () => {
  const { currency, setCurrency } = useExpenses();
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Account Settings</h2>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : user ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src={user.photoURL || ''}
                    alt="Profile"
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                <Button
                  onClick={signOut}
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <LogOut size={18} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button
                onClick={signInWithGoogle}
                variant="primary"
                className="w-full flex items-center justify-center"
              >
                <LogIn size={18} className="mr-2" />
                Sign in with Google
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-800">Currency Settings</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  variant="primary"
                  className="flex items-center w-full justify-center"
                >
                  <Save size={18} className="mr-2" />
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="bg-red-50 border border-red-200">
        <CardHeader>
          <div className="flex items-center text-red-700">
            <AlertTriangle size={20} className="mr-2" />
            <h2 className="text-lg font-semibold">Danger Zone</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            The following actions are destructive and cannot be undone.
          </p>
          <div className="space-y-3">
            <Button
              type="button"
              variant="danger"
              className="w-full"
              onClick={() => { }}
            >
              Reset All Local Data
            </Button>
            {user && (
              <Button type="button" variant="danger" className="w-full">
                Delete Cloud Data
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;