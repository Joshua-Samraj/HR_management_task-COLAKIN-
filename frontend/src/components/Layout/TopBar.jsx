import React from 'react';
import { useAuth } from '../../state/AuthContext';

const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
      <h1 className="text-lg font-semibold text-slate-800">HR Management System</h1>
      <div className="flex items-center gap-4 text-sm">
        {user && (
          <>
            <span className="text-slate-600">
              {user.name} • <span className="font-medium">{user.role}</span>
            </span>
            <button
              onClick={logout}
              className="px-3 py-1 text-xs font-medium text-white bg-slate-800 rounded-md hover:bg-slate-900"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default TopBar;


