// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import AuthenComponent from "./pages/AuthenComponent";
import CustomerHome from "./pages/CustomerHome";
import OrderDetail from "./pages/OrderDetail";
import CreateOrder from "./pages/CreateOrder";

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
            <Route path="/orders/:id"
                   element={
                <PrivateRoute allowedRoles={['customer']}>
                    <OrderDetail />
                </PrivateRoute>} />
            <Route path="/createRepairOder"
                   element={
                       <PrivateRoute allowedRoles={['customer']}>
                           <CreateOrder />
                       </PrivateRoute>} />

            {/*<Route
              path="/officer"
              element={
                <PrivateRoute allowedRoles={['officer', 'inspector', 'accountant']}>
                // somethingsomething
                </PrivateRoute>
              }
          />     */}
        </Routes>
      </Router>
  );
};

export default App;
