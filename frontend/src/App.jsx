import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminHome from "./pages/AdminHome";
import TeacherHome from "./pages/TeacherHome";
import StudentHome from "./pages/StudentHome";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import { AuthProvider, useAuth } from "./context/Authcontext";
import ResetPassword from './pages/ResetPassword';

const PrivateRoute = ({ children, role }) => {
  const { auth } = useAuth();
  if (!auth.user) {
    return <Navigate to="/login" />;
  }
  if (auth.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admin"
            element={
              <PrivateRoute role="admin">
                <AdminHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/teacher"
            element={
              <PrivateRoute role="teacher">
                <TeacherHome />
              </PrivateRoute>
            }
          />
          <Route
            path="/student"
            element={
              <PrivateRoute role="student">
                <>
                  <StudentHome />
                  <Dashboard />
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
