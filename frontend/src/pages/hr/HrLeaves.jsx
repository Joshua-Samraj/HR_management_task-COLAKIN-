import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const HrLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  const load = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaves(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Function to handle Approval or Rejection
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Call the backend PUT endpoint
      await api.put(`/leaves/${id}`, { status: newStatus });

      // Optimistically update the UI (so we don't have to reload the page)
      setLeaves((prevLeaves) =>
        prevLeaves.map((leave) =>
          leave._id === id ? { ...leave, status: newStatus } : leave
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">All Leave Requests</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Employee</th>
              <th className="px-3 py-2 text-left">Dates</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              {/* Added Actions Header */}
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} className="border-t border-slate-100">
                {/* Fixed typo: l.namnae -> l.name (or whatever your schema uses) */}
                <td className="px-3 py-2 font-medium">{String(l.name || l.namnae || 'Unknown')}</td>
                <td className="px-3 py-2">
                  {new Date(l.startDate).toLocaleDateString()} -{' '}
                  {new Date(l.endDate).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  <span className="px-2 py-1 rounded bg-gray-100 text-xs">
                    {l.type}
                  </span>
                </td>
                <td className="px-3 py-2">
                  {/* Color coding the status text */}
                  <span
                    className={`font-semibold ${
                      l.status === 'Approved'
                        ? 'text-green-600'
                        : l.status === 'Rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}
                  >
                    {l.status}
                  </span>
                </td>
                <td className="px-3 py-2 space-x-2">
                  {/* Only show buttons if status is Pending (optional logic) */}
                  {l.status !== 'Approved' && (
                    <button
                      onClick={() => handleStatusUpdate(l._id, 'Approved')}
                      className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1 rounded border border-green-200 transition"
                    >
                      Approve
                    </button>
                  )}
                  
                  {l.status !== 'Rejected' && (
                    <button
                      onClick={() => handleStatusUpdate(l._id, 'Rejected')}
                      className="text-xs bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1 rounded border border-red-200 transition"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {leaves.length === 0 && (
              <tr>
                <td
                  className="px-3 py-4 text-center text-slate-500"
                  colSpan={5} // Updated colspan to 5
                >
                  No leaves found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HrLeaves;