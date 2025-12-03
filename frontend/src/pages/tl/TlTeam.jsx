import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const TlTeam = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [teamRes, allRes] = await Promise.all([
          api.get('/employees', {
            params: { tlId: user.id },
          }),
          api.get('/employees'),
        ]);
        setTeam(teamRes.data);
        // Get employees that don't have a TL assigned
        const available = allRes.data.filter(
          (e) =>
            e.userId?.role === 'Employee' &&
            (!e.tlId || e.tlId.toString() === user.id)
        );
        setAllEmployees(available);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  const handleRemove = async (empId) => {
    if (!confirm('Remove this member from your team?')) return;
    try {
      await api.put(`/employees/${empId}`, { tlId: null });
      const res = await api.get('/employees', {
        params: { tlId: user.id },
      });
      setTeam(res.data);
      // Reload available employees
      const allRes = await api.get('/employees');
      const available = allRes.data.filter(
        (e) =>
          e.userId?.role === 'Employee' &&
          (!e.tlId || e.tlId.toString() === user.id)
      );
      setAllEmployees(available);
    } catch (e) {
      console.error(e);
      alert('Failed to remove team member');
    }
  };

  const handleAdd = async () => {
    if (!selectedEmployee) return;
    try {
      await api.put(`/employees/${selectedEmployee}`, { tlId: user.id });
      setShowAddModal(false);
      setSelectedEmployee('');
      // Reload team
      const res = await api.get('/employees', {
        params: { tlId: user.id },
      });
      setTeam(res.data);
      // Reload available employees
      const allRes = await api.get('/employees');
      const available = allRes.data.filter(
        (e) =>
          e.userId?.role === 'Employee' &&
          (!e.tlId || e.tlId.toString() === user.id)
      );
      setAllEmployees(available);
    } catch (e) {
      console.error(e);
      alert('Failed to add team member');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">My Team</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Team Member
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 mb-4"
            >
              <option value="">Select an employee</option>
              {allEmployees
                .filter((e) => !team.find((t) => t._id === e._id))
                .map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.firstName} {e.lastName} - {e.jobTitle}
                  </option>
                ))}
            </select>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedEmployee('');
                }}
                className="bg-slate-300 text-slate-700 px-4 py-2 rounded hover:bg-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Job Title</th>
              <th className="px-3 py-2 text-left">Department</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((e) => (
              <tr key={e._id} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  {e.firstName} {e.lastName}
                </td>
                <td className="px-3 py-2">{e.jobTitle}</td>
                <td className="px-3 py-2">{e.department}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => handleRemove(e._id)}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td
                  className="px-3 py-4 text-center text-slate-500"
                  colSpan={4}
                >
                  No team members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TlTeam;


