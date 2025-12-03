import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const ManagerLeaves = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);

  const load = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/leaves/by-approver/${user.id}`);
      setLeaves(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, { status });
      load();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">
        Team Leave Requests
      </h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Employee</th>
              <th className="px-3 py-2 text-left">Dates</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} className="border-t border-slate-100">
                <td className="px-3 py-2">{String(l.employeeId)}</td>
                <td className="px-3 py-2">
                  {new Date(l.startDate).toLocaleDateString()} -{' '}
                  {new Date(l.endDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">{l.type}</td>
                <td className="px-3 py-2">{l.status}</td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    className="text-xs text-emerald-700 hover:underline"
                    onClick={() => updateStatus(l._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => updateStatus(l._id, 'Rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td
                  className="px-3 py-4 text-center text-slate-500"
                  colSpan={5}
                >
                  No leave requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerLeaves;


