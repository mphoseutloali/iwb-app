
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Finance from "@/pages/Finance";
import Queries from "@/pages/Queries";
import Layout from "@/components/Layout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={
              <ProtectedRoute allowedRoles={["sales", "developer", "partner"]}>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="finance" element={
              <ProtectedRoute allowedRoles={["finance", "developer", "investor", "partner"]}>
                <Finance />
              </ProtectedRoute>
            } />
            <Route path="queries" element={
              <ProtectedRoute allowedRoles={["sales", "developer"]}>
                <Queries />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
