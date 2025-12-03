import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const emptyForm = {
  startDate: '',
  endDate: '',
  type: 'Casual',
  reason: '',
  name: '',
};

const EmployeeLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    if (!user?.employeeId) return;
    try {
      const res = await api.get(`/leaves/by-employee/${user.employeeId}`);
      setLeaves(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.employeeId) return;
    try {
      await api.post('/leaves', {
        employeeId: user.employeeId,
        startDate: form.startDate,
        endDate: form.endDate,
        type: form.type,
        name: form.name,
        reason: form.reason,
        approverId: null,
      });
      setForm(emptyForm);
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">
          My Leave Applications
        </h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Dates</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">
                    {new Date(l.startDate).toLocaleDateString()} -{' '}
                    {new Date(l.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">{l.type}</td>
                  <td className="px-3 py-2">{l.status}</td>
                </tr>
              ))}
              {leaves.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-500"
                    colSpan={3}
                  >
                    No leave applications yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-slate-800 mb-3">
          Apply for Leave
        </h3>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-4 space-y-3"
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                value={form.startDate}
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
                value={form.endDate}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Type
            </label>
            <select
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="Casual">Casual</option>
              <option value="Sick">Sick</option>
              <option value="Earned">Earned</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Name
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              rows={1}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Reason
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 text-white py-2 rounded-md text-sm font-medium hover:bg-slate-900"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeLeaves;


