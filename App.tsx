import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import ClientSelection from './views/ClientSelection';
import VisitDashboard from './views/VisitDashboard';
import ProductSelection from './views/ProductSelection';
import CompetitorSelection from './views/CompetitorSelection';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/clients" element={<ClientSelection />} />
        <Route path="/dashboard" element={<VisitDashboard />} />
        <Route path="/products" element={<ProductSelection />} />
        <Route path="/competitors" element={<CompetitorSelection />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;