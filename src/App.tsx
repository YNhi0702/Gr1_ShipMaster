// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import AuthenComponent from "./pages/AuthenComponent";
import CustomerHome from "./pages/CustomerHome";

const App: React.FC = () => {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<AuthenComponent />} />

          <Route
              path="/"
              element={
                <PrivateRoute allowedRoles={['customer']}>
                    <CustomerHome/>
                </PrivateRoute>
              }
          />

          <Route
              path="/officer"
              element={
                <PrivateRoute allowedRoles={['officer', 'inspector', 'accountant']}>
                {/*    something */}
                </PrivateRoute>
              }
          />
        </Routes>
      </Router>
  );
};

export default App;
