import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === 'Admin') navigate('/hr');
      else if (user.role === 'Manager') navigate('/manager');
      else if (user.role === 'TL') navigate('/tl');
      else navigate('/employee');
    } catch {
      // error is handled in context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-800 text-center">
          HRMS Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-900 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="text-xs text-slate-500">
          <p>Sample users (after seeding):</p>
          <p>Admin: admin@hr.com / password123</p>
          <p>Manager: manager0@hr.com / password123</p>
          <p>TL: tl0@hr.com / password123</p>
          <p>Employee: employee0@hr.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;


