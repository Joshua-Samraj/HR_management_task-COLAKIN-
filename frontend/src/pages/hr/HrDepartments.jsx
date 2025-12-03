import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const HrDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data);
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
        await api.put(`/departments/${editingId}`, form);
      } else {
        await api.post('/departments', form);
      }
      setForm({ name: '', code: '', description: '' });
      setEditingId(null);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept._id);
    setForm({
      name: dept.name,
      code: dept.code || '',
      description: dept.description || '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          Departments
        </h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Code</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((d) => (
                <tr key={d._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{d.name}</td>
                  <td className="px-3 py-2">{d.code}</td>
                  <td className="px-3 py-2 space-x-2">
                    <button
                      className="text-xs text-slate-700 hover:underline"
                      onClick={() => handleEdit(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => handleDelete(d._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {departments.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-500"
                    colSpan={3}
                  >
                    No departments yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-slate-800 mb-3">
          {editingId ? 'Edit Department' : 'Add Department'}
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
              Code
            </label>
            <input
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
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

export default HrDepartments;


