import React from 'react';
import { ExpenseProvider } from './context/ExpenseContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <ExpenseProvider>
      <Layout />
    </ExpenseProvider>
  );
}

export default App;