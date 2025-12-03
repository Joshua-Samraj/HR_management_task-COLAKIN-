import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const emptyForm = {
  name: '',
  email: '',
  password: '',
  role: 'Employee',
  
};

const HrUsers = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const payload = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editingId}`, payload);
      } else {
        await api.post('/users', form);
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (u) => {
    setEditingId(u._id);
    setForm({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
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

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">Users</h2>
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
              {users.map((u) => (
                <tr key={u._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{u.name}</td>
                  <td className="px-3 py-2">{u.email}</td>
                  <td className="px-3 py-2">{u.role}</td>
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
              {users.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-500"
                    colSpan={4}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-slate-800 mb-3">
          {editingId ? 'Edit User' : 'Add User'}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-4 space-y-3"
        >
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={editingId ? 'Leave blank to keep current' : ''}
              {...(!editingId && { required: true })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="Admin">Admin (HR)</option>
              <option value="Manager">Manager</option>
              <option value="TL">Team Lead</option>
              <option value="Employee">Employee</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HrUsers;


