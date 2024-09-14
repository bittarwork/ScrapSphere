// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import UserDashboard from "./pages/Buyer/UserDashboard";
import Unauthorized from "./pages/Unauthorized"; // Page to show unauthorized access message

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <ProtectedRoute
            path="/admin-dashboard"
            element={<AdminDashboard />}
            roles={["super_user"]}
          />
          <ProtectedRoute
            path="/user-dashboard"
            element={<UserDashboard />}
            roles={["buyer"]}
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
