import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ExpenseProvider } from './context/ExpenseContext';
import { AuthProvider, RequireAuth } from './utils/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './components/auth/HomePage';
import ErrorBoundary from './context/ErrorBoundary';

function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/dashboard/*"
                element={
                  <RequireAuth>
                    <ExpenseProvider>
                      <Layout />
                    </ExpenseProvider>
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </React.StrictMode>
  );
}

export default App;