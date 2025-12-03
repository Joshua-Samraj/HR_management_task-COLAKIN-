import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const TlComplaints = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);

  const load = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/complaints/by-resolver/${user.id}`);
      setComplaints(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">
        Team Complaints
      </h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Employee</th>
              <th className="px-3 py-2 text-left">Description</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id} className="border-t border-slate-100">
                <td className="px-3 py-2">{String(c.employeeId)}</td>
                <td className="px-3 py-2">{c.description}</td>
                <td className="px-3 py-2">{c.status}</td>
              </tr>
            ))}
            {complaints.length === 0 && (
              <tr>
                <td
                  className="px-3 py-4 text-center text-slate-500"
                  colSpan={3}
                >
                  No complaints.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TlComplaints;


