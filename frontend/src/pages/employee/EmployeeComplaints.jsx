import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const emptyForm = {
  name: '',
  description: '',
};

const EmployeeComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    if (!user?.employeeId) return;
    try {
      const res = await api.get(
        `/complaints/by-employee/${user.employeeId}`
      );
      setComplaints(res.data);
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
      await api.post('/complaints', {
        name: form.name,
        employeeId: user.employeeId,
        description: form.description,
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
          My Complaints
        </h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-2 text-left">Description</th>
                <th className="px-3 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id} className="border-t border-slate-100">
                  <td className="px-3 py-2">{c.description}</td>
                  <td className="px-3 py-2">{c.status}</td>
                </tr>
              ))}
              {complaints.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-500"
                    colSpan={2}
                  >
                    No complaints yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h3 className="text-md font-semibold text-slate-800 mb-3">
          Submit Complaint
        </h3>
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-4 space-y-3"
        >
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
              Description
            </label>
            <textarea
              className="w-full border border-slate-300 rounded-md px-2 py-1 text-sm"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
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

export default EmployeeComplaints;


