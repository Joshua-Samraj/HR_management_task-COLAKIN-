import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const HrStaff = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('managers');
  const [managersList, setManagersList] = useState([]);
  const [tlsList, setTlsList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [allTls, setAllTls] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ managerId: '', tlId: '' });

  useEffect(() => {
    const load = async () => {
      try {
        const [employeesRes, usersRes] = await Promise.all([
          api.get('/employees'),
          api.get('/users'),
        ]);
        const all = employeesRes.data;
        const users = usersRes.data;
        
        // Separate by role
        setManagersList(all.filter((e) => e.userId?.role === 'Manager'));
        setTlsList(all.filter((e) => e.userId?.role === 'TL'));
        setEmployeesList(all.filter((e) => e.userId?.role === 'Employee'));
        
        // For dropdowns
        setAllManagers(users.filter((u) => u.role === 'Manager'));
        setAllTls(users.filter((u) => u.role === 'TL'));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setEditData({
      managerId: emp.managerId?._id || emp.managerId || '',
      tlId: emp.tlId?._id || emp.tlId || '',
    });
  };

  const handleSave = async (empId) => {
    try {
      await api.put(`/employees/${empId}`, editData);
      setEditingId(null);
      // Reload all data
      const [employeesRes] = await Promise.all([api.get('/employees')]);
      const all = employeesRes.data;
      setManagersList(all.filter((e) => e.userId?.role === 'Manager'));
      setTlsList(all.filter((e) => e.userId?.role === 'TL'));
      setEmployeesList(all.filter((e) => e.userId?.role === 'Employee'));
    } catch (e) {
      console.error(e);
      alert('Failed to update employee');
    }
  };

  const renderTable = (data, role) => {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Job Title</th>
              <th className="px-3 py-2 text-left">Department</th>
             
              {role === 'TL' && (
                <th className="px-3 py-2 text-left">Manager</th>
              )}
              {role === 'Employee' && (
                <>
                  <th className="px-3 py-2 text-left">Manager</th>
                  <th className="px-3 py-2 text-left">Team Lead</th>
                </>
              )}
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((e) => (
              <tr key={e._id} className="border-t border-slate-100">
                <td className="px-3 py-2">
                  {e.firstName} {e.lastName}
                </td>
                <td className="px-3 py-2">{e.jobTitle}</td>
                <td className="px-3 py-2">{e.department}</td>
                
                {role === 'TL' && (
                  <td className="px-3 py-2">
                    {editingId === e._id ? (
                      <select
                        value={editData.managerId}
                        onChange={(ev) =>
                          setEditData({ ...editData, managerId: ev.target.value })
                        }
                        className="border border-slate-300 rounded text-xs px-2 py-1 w-full"
                      >
                        <option value="">None</option>
                        {allManagers.map((m) => (
                          <option key={m._id} value={m._id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-slate-600">
                        {e.managerId?.name || 'N/A'}
                      </span>
                    )}
                  </td>
                )}
                {role === 'Employee' && (
                  <>
                    <td className="px-3 py-2">
                      {editingId === e._id ? (
                        <select
                          value={editData.managerId}
                          onChange={(ev) =>
                            setEditData({ ...editData, managerId: ev.target.value })
                          }
                          className="border border-slate-300 rounded text-xs px-2 py-1 w-full"
                        >
                          <option value="">None</option>
                          {allManagers.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-600">
                          {e.managerId?.name || 'N/A'}
                        </span>
                      )}
                    </td>
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
                          {allTls.map((tl) => (
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
                  </>
                )}
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
                        onClick={() => navigate(`/hr/employee/${e._id}`)}
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => handleEdit(e)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  className="px-3 py-4 text-center text-slate-500"
                  colSpan={role === 'Manager' ? 5 : role === 'TL' ? 5 : 6}
                >
                  No {role.toLowerCase()}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ managerId: '', tlId: '' });
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800">Staff</h2>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => {
              setActiveTab('managers');
              setEditingId(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'managers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Managers ({managersList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('tls');
              setEditingId(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tls'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Team Leads ({tlsList.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('employees');
              setEditingId(null);
            }}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'employees'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            Employees ({employeesList.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'managers' && renderTable(managersList, 'Manager')}
        {activeTab === 'tls' && renderTable(tlsList, 'TL')}
        {activeTab === 'employees' && renderTable(employeesList, 'Employee')}
      </div>
    </div>
  );
};

export default HrStaff;


