import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/layout/Layout';
import { AuthProvider } from './utils/AuthContext';
import ErrorBoundary from './context/ErrorBoundary';

function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <ExpenseProvider>
            <Layout />
          </ExpenseProvider>
        </AuthProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;