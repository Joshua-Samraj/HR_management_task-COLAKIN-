import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../state/AuthContext';

const NavItem = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`block px-3 py-2 rounded-md text-sm font-medium ${
        active ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="w-56 bg-white border-r border-slate-200 p-4">
      <nav className="space-y-1">
        {user.role === 'Admin' && (
          <>
            <NavItem to="/hr" label="HR Dashboard" />
            <NavItem to="/hr/staff" label="Staff" />
            <NavItem to="/hr/departments" label="Departments" />
            <NavItem to="/hr/leaves" label="Leaves" />
            <NavItem to="/hr/complaints" label="Complaints" />
            <NavItem to="/hr/users" label="Users" />
          </>
        )}
        {user.role === 'Manager' && (
          <>
            <NavItem to="/manager" label="Manager Dashboard" />
            <NavItem to="/manager/team" label="Team" />
            <NavItem to="/manager/leaves" label="Leaves" />
            <NavItem to="/manager/complaints" label="Complaints" />
          </>
        )}
        {user.role === 'TL' && (
          <>
            <NavItem to="/tl" label="TL Dashboard" />
            <NavItem to="/tl/team" label="Team" />
            <NavItem to="/tl/leaves" label="Leaves" />
            <NavItem to="/tl/complaints" label="Complaints" />
          </>
        )}
        {user.role === 'Employee' && (
          <>
            <NavItem to="/employee" label="My Dashboard" />
            <NavItem to="/employee/leaves" label="My Leaves" />
            <NavItem to="/employee/complaints" label="My Complaints" />
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;


