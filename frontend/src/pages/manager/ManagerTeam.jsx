import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const ManagerTeam = () => {
  const { user } = useAuth();
  const [team, setTeam] = useState([]);
  const [tls, setTls] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ tlId: '' });

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const [teamRes, usersRes] = await Promise.all([
          api.get('/employees', {
            params: { managerId: user.id },
          }),
          api.get('/users'),
        ]);
        setTeam(teamRes.data);
        setTls(usersRes.data.filter((u) => u.role === 'TL'));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setEditData({
      tlId: emp.tlId?._id || emp.tlId || '',
    });
  };

  const handleSave = async (empId) => {
    try {
      await api.put(`/employees/${empId}`, editData);
      setEditingId(null);
      // Reload team
      const res = await api.get('/employees', {
        params: { managerId: user.id },
      });
      setTeam(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to update team member');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ tlId: '' });
  };

  const handleRemove = async (empId) => {
    if (!confirm('Remove this member from your team?')) return;
    try {
      await api.put(`/employees/${empId}`, { managerId: null });
      const res = await api.get('/employees', {
        params: { managerId: user.id },
      });
      setTeam(res.data);
    } catch (e) {
      console.error(e);
      alert('Failed to remove team member');
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">My Team</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Job Title</th>
              <th className="px-3 py-2 text-left">Department</th>
              <th className="px-3 py-2 text-left">Team Lead</th>
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
                  {editingId === e._id ? (
                    <select
                      value={editData.tlId}
                      onChange={(ev) =>
                        setEditData({ ...editData, tlId: ev.target.value })
                      }
                      className="border border-slate-300 rounded text-xs px-2 py-1 w-full"
                    >
                      <option value="">None</option>
                      {tls.map((tl) => (
                        <option key={tl._id} value={tl._id}>
                          {tl.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-slate-600">
                      {e.tlId?.name || 'N/A'}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {editingId === e._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(e._id)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-xs bg-slate-300 text-slate-700 px-2 py-1 rounded hover:bg-slate-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(e)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Edit TL
                      </button>
                      {e.userId?.role === 'Employee' && (
                        <button
                          onClick={() => handleRemove(e._id)}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {team.length === 0 && (
              <tr>
                <td
                  className="px-3 py-4 text-center text-slate-500"
                  colSpan={5}
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

export default ManagerTeam;


