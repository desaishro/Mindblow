import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EmotionalStateTracker from './pages/EmotionalStateTracker';
import PrivateRoute from './components/PrivateRoute';
import Authentication from './pages/Authentication';

const App = () => {
  const { token } = useSelector((state) => state.user);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Authentication />} />

        {/* Protected routes */}
        <Route path="/emotional-state" element={
          <PrivateRoute>
            <EmotionalStateTracker />
          </PrivateRoute>
        } />

        {/* Add other protected routes here */}
      </Routes>
    </Router>
  );
};

export default App; 