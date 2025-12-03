import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Define the available status options
const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed'];

const HrComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // To track which item is updating

  const load = async () => {
    try {
      const res = await api.get('/complaints');
      setComplaints(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Function to handle status change via Dropdown
  const handleStatusChange = async (id, newStatus) => {
    setLoadingId(id); // Show loading state for this row
    try {
      // 1. Update Backend
      await api.put(`/complaints/${id}`, { status: newStatus });

      // 2. Update Frontend State (Optimistic Update)
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Error updating status");
    } finally {
      setLoadingId(null);
    }
  };

  // Helper function for badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-700';
      case 'In Progress': return 'bg-yellow-100 text-yellow-700';
      case 'Resolved': return 'bg-green-100 text-green-700';
      case 'Closed': return 'bg-gray-200 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Complaints Management</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Employee</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Current Status</th>
              <th className="px-3 py-2 text-left">Update Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{c.name || 'Anonymous'}</td>
                <td className="px-3 py-2 max-w-md truncate" title={c.description}>
                  {c.description}
                </td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(c.status)}`}>
                    {c.status || 'Open'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <select
                    className="border border-slate-300 rounded px-2 py-1 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    value={c.status || 'Open'}
                    onChange={(e) => handleStatusChange(c._id, e.target.value)}
                    disabled={loadingId === c._id}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {loadingId === c._id && <span className="ml-2 text-xs text-gray-400">Saving...</span>}
                </td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td className="px-3 py-4 text-center text-slate-500" colSpan={4}>
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrComplaints;