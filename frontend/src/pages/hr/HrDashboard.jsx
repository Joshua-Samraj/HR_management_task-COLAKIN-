import React, { useEffect, useState } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const StatCard = ({ label, value }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-800">{value}</p>
  </div>
);

const HrDashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    managers: 0,
    tls: 0,
    departments: 0,
  });
  const [hierarchy, setHierarchy] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [employeesRes, usersRes, deptRes, hierarchyRes] = await Promise.all([
          api.get('/employees'),
          api.get('/users'),
          api.get('/departments'),
          api.get('/employees/hierarchy/all'),
        ]);
        const users = usersRes.data;
        setStats({
          employees: employeesRes.data.length,
          managers: users.filter((u) => u.role === 'Manager').length,
          tls: users.filter((u) => u.role === 'TL').length,
          departments: deptRes.data.length,
        });
        setHierarchy(hierarchyRes.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-slate-800">HR Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={stats.employees} />
        <StatCard label="Managers" value={stats.managers} />
        <StatCard label="Team Leads" value={stats.tls} />
        <StatCard label="Departments" value={stats.departments} />
      </div>

      {/* Organizational Hierarchy */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Organizational Hierarchy
        </h3>
        <div className="space-y-6">
          {hierarchy.length === 0 ? (
            <p className="text-sm text-slate-500">No hierarchy data available.</p>
          ) : (
            hierarchy.map((manager) => (
              <div key={manager._id} className="border-l-2 border-blue-300 pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-slate-800">
                    👤 {manager.firstName} {manager.lastName}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Manager
                  </span>
                  <span className="text-xs text-slate-500">
                    ({manager.department})
                  </span>
                </div>

                {/* Team Leads under this Manager */}
                {manager.tls && manager.tls.length > 0 && (
                  <div className="ml-4 mt-3 space-y-3">
                    {manager.tls.map((tl) => (
                      <div key={tl._id} className="border-l-2 border-green-300 pl-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-slate-700">
                            👥 {tl.firstName} {tl.lastName}
                          </span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Team Lead
                          </span>
                          <span className="text-xs text-slate-500">
                            ({tl.employees?.length || 0} members)
                          </span>
                        </div>

                        {/* Employees under this TL */}
                        {tl.employees && tl.employees.length > 0 && (
                          <div className="ml-4 mt-2 space-y-1">
                            {tl.employees.map((emp) => (
                              <div
                                key={emp._id}
                                className="text-sm text-slate-600 flex items-center gap-2"
                              >
                                <span>•</span>
                                <span>
                                  {emp.firstName} {emp.lastName}
                                </span>
                                <span className="text-xs text-slate-400">
                                  ({emp.jobTitle})
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Direct Employees under Manager (no TL) */}
                {manager.directEmployees && manager.directEmployees.length > 0 && (
                  <div className="ml-4 mt-3">
                    <p className="text-xs text-slate-500 mb-1">Direct Reports:</p>
                    <div className="space-y-1">
                      {manager.directEmployees.map((emp) => (
                        <div
                          key={emp._id}
                          className="text-sm text-slate-600 flex items-center gap-2"
                        >
                          <span>•</span>
                          <span>
                            {emp.firstName} {emp.lastName}
                          </span>
                          <span className="text-xs text-slate-400">
                            ({emp.jobTitle})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <p className="text-sm text-slate-600">
        Use the sidebar to manage staff, departments, leaves, complaints and users.
      </p>
    </div>
  );
};

export default HrDashboard;


