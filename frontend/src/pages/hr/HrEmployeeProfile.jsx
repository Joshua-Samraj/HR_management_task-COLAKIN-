import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const HrEmployeeProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For editing
  const [editingSection, setEditingSection] = useState(null);
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    department: '',
    managerId: '',
    tlId: '',
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [allTls, setAllTls] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [
          empRes,
          leavesRes,
          complaintsRes,
          usersRes,
          employeesRes,
          deptRes,
        ] = await Promise.all([
          api.get(`/employees/${id}`),
          api.get(`/leaves/by-employee/${id}`),
          api.get(`/complaints/by-employee/${id}`),
          api.get('/users'),
          api.get('/employees'),
          api.get('/departments'),
        ]);
        
        const emp = empRes.data;
        setEmployee(emp);
        setLeaves(leavesRes.data || []);
        setComplaints(complaintsRes.data || []);
        
        // Set edit data
        setEditData({
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          jobTitle: emp.jobTitle || '',
          department: emp.department || '',
          managerId: emp.managerId?._id || emp.managerId || '',
          tlId: emp.tlId?._id || emp.tlId || '',
        });
        
        // Load dropdown options
        setAllManagers(usersRes.data.filter((u) => u.role === 'Manager'));
        setAllTls(usersRes.data.filter((u) => u.role === 'TL'));
        setAllEmployees(employeesRes.data.filter((e) => e.userId?.role === 'Employee'));
        setDepartments(deptRes.data);
        
        // Load team members if Manager or TL
        if (emp.userId?.role === 'Manager') {
          const team = employeesRes.data.filter(
            (e) => e.managerId?.toString() === emp.userId?._id?.toString()
          );
          setTeamMembers(team);
        } else if (emp.userId?.role === 'TL') {
          const team = employeesRes.data.filter(
            (e) => e.tlId?.toString() === emp.userId?._id?.toString()
          );
          setTeamMembers(team);
        }
      } catch (e) {
        console.error(e);
        alert('Failed to load employee profile');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleSave = async (section) => {
    try {
      const updates = {};
      
      if (section === 'personal') {
        updates.firstName = editData.firstName;
        updates.lastName = editData.lastName;
        updates.jobTitle = editData.jobTitle;
        updates.department = editData.department;
      } else if (section === 'manager') {
        updates.managerId = editData.managerId || null;
      } else if (section === 'tl') {
        updates.tlId = editData.tlId || null;
      } else if (section === 'department') {
        updates.department = editData.department;
      }
      
      await api.put(`/employees/${id}`, updates);
      
      // Reload employee data
      const empRes = await api.get(`/employees/${id}`);
      setEmployee(empRes.data);
      setEditData({
        ...editData,
        firstName: empRes.data.firstName || '',
        lastName: empRes.data.lastName || '',
        jobTitle: empRes.data.jobTitle || '',
        department: empRes.data.department || '',
        managerId: empRes.data.managerId?._id || empRes.data.managerId || '',
        tlId: empRes.data.tlId?._id || empRes.data.tlId || '',
      });
      
      setEditingSection(null);
      alert('Updated successfully');
    } catch (e) {
      console.error(e);
      alert('Failed to update');
    }
  };

  const handleUpdateTeamMember = async (memberId, field, value) => {
    try {
      await api.put(`/employees/${memberId}`, { [field]: value || null });
      // Reload team members
      const employeesRes = await api.get('/employees');
      if (employee.userId?.role === 'Manager') {
        const team = employeesRes.data.filter(
          (e) => e.managerId?.toString() === employee.userId?._id?.toString()
        );
        setTeamMembers(team);
      } else if (employee.userId?.role === 'TL') {
        const team = employeesRes.data.filter(
          (e) => e.tlId?.toString() === employee.userId?._id?.toString()
        );
        setTeamMembers(team);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to update team member');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6">
        <p className="text-slate-600">Employee not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/hr/staff')}
          className="text-slate-600 hover:text-slate-800"
        >
          ← Back to Staff
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-6 flex-1">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(employee.firstName, employee.lastName)}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              {editingSection === 'personal' ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">First Name</label>
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Last Name</label>
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Job Title</label>
                    <input
                      type="text"
                      value={editData.jobTitle}
                      onChange={(e) => setEditData({ ...editData, jobTitle: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Department</label>
                    <select
                      value={editData.department}
                      onChange={(e) => setEditData({ ...editData, department: e.target.value })}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave('personal')}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="bg-slate-300 text-slate-700 px-4 py-2 rounded text-sm hover:bg-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-lg text-slate-600 mb-1">{employee.jobTitle}</p>
                  <p className="text-sm text-slate-500 mb-4">{employee.department}</p>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email</p>
                      <p className="text-sm text-slate-700">{employee.userId?.email}</p>
                    </div>
                    {employee.hireDate && (
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Hire Date</p>
                        <p className="text-sm text-slate-700">
                          {new Date(employee.hireDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          {editingSection !== 'personal' && (
            <button
              onClick={() => setEditingSection('personal')}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Edit Personal Info
            </button>
          )}
        </div>
      </div>

      {/* Manager and TL Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manager Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Manager Details
            </h3>
            {/* Show edit button for TLs and Employees (not for Managers themselves) */}
            {(employee.userId?.role === 'TL' || employee.userId?.role === 'Employee') && 
             editingSection !== 'manager' && (
              <button
                onClick={() => setEditingSection('manager')}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
          {editingSection === 'manager' ? (
            <div className="space-y-3">
              <select
                value={editData.managerId}
                onChange={(e) => setEditData({ ...editData, managerId: e.target.value })}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              >
                <option value="">No Manager</option>
                {allManagers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('manager')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-slate-300 text-slate-700 px-3 py-1 rounded text-xs hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : employee.managerId ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {getInitials(
                      employee.managerId.name?.split(' ')[0] || '',
                      employee.managerId.name?.split(' ')[1] || ''
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    {employee.managerId.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {employee.managerId.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No manager assigned</p>
          )}
        </div>

        {/* Team Lead Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">
              Team Lead Details
            </h3>
            {/* Show edit button for Managers and Employees (not for TLs themselves) */}
            {(employee.userId?.role === 'Manager' || employee.userId?.role === 'Employee') && 
             editingSection !== 'tl' && (
              <button
                onClick={() => setEditingSection('tl')}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Edit
              </button>
            )}
          </div>
          {editingSection === 'tl' ? (
            <div className="space-y-3">
              <select
                value={editData.tlId}
                onChange={(e) => setEditData({ ...editData, tlId: e.target.value })}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              >
                <option value="">No Team Lead</option>
                {allTls.map((tl) => (
                  <option key={tl._id} value={tl._id}>
                    {tl.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave('tl')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSection(null)}
                  className="bg-slate-300 text-slate-700 px-3 py-1 rounded text-xs hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : employee.tlId ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    {getInitials(
                      employee.tlId.name?.split(' ')[0] || '',
                      employee.tlId.name?.split(' ')[1] || ''
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">
                    {employee.tlId.name}
                  </p>
                  <p className="text-sm text-slate-500">
                    {employee.tlId.email}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No team lead assigned</p>
          )}
        </div>
      </div>

      {/* Team Members Section (for Managers and TLs) */}
      {(employee.userId?.role === 'Manager' || employee.userId?.role === 'TL') && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Team Members ({teamMembers.length})
          </h3>
          {teamMembers.length === 0 ? (
            <p className="text-sm text-slate-500">No team members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Job Title</th>
                    <th className="px-3 py-2 text-left">Department</th>
                    {employee.userId?.role === 'Manager' && (
                      <th className="px-3 py-2 text-left">Team Lead</th>
                    )}
                    {employee.userId?.role === 'TL' && (
                      <th className="px-3 py-2 text-left">Manager</th>
                    )}
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member._id} className="border-t border-slate-100">
                      <td className="px-3 py-2">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-3 py-2">{member.jobTitle}</td>
                      <td className="px-3 py-2">{member.department}</td>
                      {employee.userId?.role === 'Manager' && (
                        <td className="px-3 py-2">
                          <select
                            value={member.tlId?._id || member.tlId || ''}
                            onChange={(e) =>
                              handleUpdateTeamMember(member._id, 'tlId', e.target.value)
                            }
                            className="border border-slate-300 rounded text-xs px-2 py-1"
                          >
                            <option value="">None</option>
                            {allTls.map((tl) => (
                              <option key={tl._id} value={tl._id}>
                                {tl.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      {employee.userId?.role === 'TL' && (
                        <td className="px-3 py-2">
                          <select
                            value={member.managerId?._id || member.managerId || ''}
                            onChange={(e) =>
                              handleUpdateTeamMember(member._id, 'managerId', e.target.value)
                            }
                            className="border border-slate-300 rounded text-xs px-2 py-1"
                          >
                            <option value="">None</option>
                            {allManagers.map((m) => (
                              <option key={m._id} value={m._id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      )}
                      <td className="px-3 py-2">
                        <button
                          onClick={() => {
                            if (employee.userId?.role === 'Manager') {
                              handleUpdateTeamMember(member._id, 'managerId', null);
                            } else {
                              handleUpdateTeamMember(member._id, 'tlId', null);
                            }
                          }}
                          className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Leave Requests Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Leave Requests ({leaves.length})
        </h3>
        {leaves.length === 0 ? (
          <p className="text-sm text-slate-500">No leave requests found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Start Date</th>
                  <th className="px-3 py-2 text-left">End Date</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-left">Reason</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((leave) => (
                  <tr key={leave._id} className="border-t border-slate-100">
                    <td className="px-3 py-2">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2">{leave.type || 'N/A'}</td>
                    <td className="px-3 py-2">{leave.reason || '-'}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getStatusColor(
                          leave.status
                        )}`}
                      >
                        {leave.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaints Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Complaints ({complaints.length})
        </h3>
        {complaints.length === 0 ? (
          <p className="text-sm text-slate-500">No complaints found.</p>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div
                key={complaint._id}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {complaint.description}
                    </p>
                    {complaint.againstId && (
                      <p className="text-xs text-slate-500 mt-1">
                        Against: {complaint.againstId.name || 'N/A'}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    {complaint.status || 'Open'}
                  </span>
                </div>
                {complaint.resolutionNotes && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Resolution:</p>
                    <p className="text-sm text-slate-700">
                      {complaint.resolutionNotes}
                    </p>
                  </div>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  Submitted:{' '}
                  {new Date(complaint.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HrEmployeeProfile;

