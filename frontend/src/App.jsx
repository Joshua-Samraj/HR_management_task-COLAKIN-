import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './state/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import TopBar from './components/Layout/TopBar';
import Sidebar from './components/Layout/Sidebar';
import HrDashboard from './pages/hr/HrDashboard';
import HrStaff from './pages/hr/HrStaff';
import HrDepartments from './pages/hr/HrDepartments';
import HrLeaves from './pages/hr/HrLeaves';
import HrComplaints from './pages/hr/HrComplaints';
import HrUsers from './pages/hr/HrUsers';
import HrEmployeeProfile from './pages/hr/HrEmployeeProfile';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import ManagerTeam from './pages/manager/ManagerTeam';
import ManagerLeaves from './pages/manager/ManagerLeaves';
import ManagerComplaints from './pages/manager/ManagerComplaints';
import TlDashboard from './pages/tl/TlDashboard';
import TlTeam from './pages/tl/TlTeam';
import TlLeaves from './pages/tl/TlLeaves';
import TlComplaints from './pages/tl/TlComplaints';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeeLeaves from './pages/employee/EmployeeLeaves';
import EmployeeComplaints from './pages/employee/EmployeeComplaints';

const Shell = ({ children }) => {
  const { user } = useAuth();
  if (!user) return children;

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-slate-100 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Shell>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* HR / Admin */}
        <Route
          path="/hr"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/staff"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/departments"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrDepartments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/leaves"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/complaints"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/users"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employee/:id"
          element={
            <ProtectedRoute roles={['Admin']}>
              <HrEmployeeProfile />
            </ProtectedRoute>
          }
        />

        {/* Manager */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={['Manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/team"
          element={
            <ProtectedRoute roles={['Manager']}>
              <ManagerTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/leaves"
          element={
            <ProtectedRoute roles={['Manager']}>
              <ManagerLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager/complaints"
          element={
            <ProtectedRoute roles={['Manager']}>
              <ManagerComplaints />
            </ProtectedRoute>
          }
        />

        {/* Team Lead */}
        <Route
          path="/tl"
          element={
            <ProtectedRoute roles={['TL']}>
              <TlDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tl/team"
          element={
            <ProtectedRoute roles={['TL']}>
              <TlTeam />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tl/leaves"
          element={
            <ProtectedRoute roles={['TL']}>
              <TlLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tl/complaints"
          element={
            <ProtectedRoute roles={['TL']}>
              <TlComplaints />
            </ProtectedRoute>
          }
        />

        {/* Employee */}
        <Route
          path="/employee"
          element={
            <ProtectedRoute roles={['Employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/leaves"
          element={
            <ProtectedRoute roles={['Employee']}>
              <EmployeeLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/complaints"
          element={
            <ProtectedRoute roles={['Employee']}>
              <EmployeeComplaints />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Shell>
  );
};

export default App;




