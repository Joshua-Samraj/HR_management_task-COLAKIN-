import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Initial state includes both User and Employee fields
const emptyForm = {
  // User Account Fields
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  
  // Employee Profile Fields
  firstName: '',
  lastName: '',
  jobTitle: '',
  department: '',
  hireDate: '',
  // managerId, hrId, tlId can be added here if you have dropdowns to select them
};

const HrUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // State for search query

  const load = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
    } catch (e) {
      console.error("Failed to load departments", e);
    }
  };

  useEffect(() => {
    load();
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update logic (focused on User info for now)
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editingId}`, payload);
      } else {
        // CREATE Logic: Includes nested Employee data
        const payload = {
            name: form.name,
            email: form.email,
            password: form.password,
            role: form.role,
            employee: {
                firstName: form.firstName,
                lastName: form.lastName,
                jobTitle: form.jobTitle,
                department: form.department,
                hireDate: form.hireDate
            }
        };
        await api.post('/users', payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Error occurred');
    }
  };

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({
      ...emptyForm,
      name: u.name,
      email: u.email,
      role: u.role,
      password: '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user and their employee profile?')) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.role?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      {/* LEFT COLUMN: List of Users */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg font-semibold text-slate-800">System Users</h2>
            <input 
                type="text" 
                placeholder="Search by name, email, or role..." 
                className="w-full sm:w-64 border border-slate-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Email</th>
                <th className="px-3 py-2 text-left">Role</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">{u.name}</td>
                  <td className="px-3 py-2 text-slate-500">{u.email}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                        u.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 
                        'bg-slate-100 text-slate-600'
                    }`}>
                        {u.role}
                    </span>
                  </td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      className="text-xs text-slate-700 hover:underline"
                      onClick={() => handleEdit(u)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => handleDelete(u._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center text-slate-500" colSpan={4}>
                    No users found matching "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT COLUMN: Create/Edit Form */}
      <div>
        <h3 className="text-md font-semibold text-slate-800 mb-3">
          {editingId ? 'Edit Account' : 'Onboard New Employee'}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-4 space-y-4"
        >
          {/* Section: Account Login Details */}
          <div className="space-y-3 border-b pb-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Credentials</h4>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Username / Display Name</label>
              <input
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <input
                    type="password"
                    className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder={editingId ? '(Unchanged)' : 'Secret...'}
                    {...(!editingId && { required: true })}
                />
                </div>
                <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role</label>
                <select
                    className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                    <option value="Admin">Admin (HR)</option>
                    <option value="Manager">Manager</option>
                    <option value="TL">Team Lead</option>
                    <option value="Employee">Employee</option>
                </select>
                </div>
            </div>
          </div>

          {/* Section: Employee Details - ONLY SHOW ON CREATE */}
          {!editingId && (
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employee Profile</h4>
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                        <input
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                        <input
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Job Title</label>

                <select
                    className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white"
                    value={form.jobTitle}
                    onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
                >
                    <option value="Admin">Admin (HR)</option>
                    <option value="Manager">Manager</option>
                    <option value="TL">Team Lead</option>
                    <option value="Employee">Employee</option>
                </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                        <select
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm bg-white"
                            value={form.department}
                            onChange={(e) => setForm({ ...form, department: e.target.value })}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option 
                                    key={dept._id || dept.name || dept} 
                                    value={dept.name || dept}
                                >
                                    {dept.name || dept}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">Hire Date</label>
                        <input
                            type="date"
                            className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm"
                            value={form.hireDate}
                            onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-900 transition-colors mt-4"
          >
            {editingId ? 'Update User Account' : 'Create User & Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HrUsers;