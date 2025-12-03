import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [teamCounts, setTeamCounts] = useState({ tls: 0, employees: 0 });

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      try {
        const res = await api.get('/employees', {
          params: { managerId: user.id },
        });
        const employees = res.data;
        setTeamCounts({
          tls: employees.filter((e) => e.userId?.role === 'TL').length,
          employees: employees.filter((e) => e.userId?.role === 'Employee')
            .length,
        });
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">
        Manager Dashboard
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Team Leads
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {teamCounts.tls}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Employees
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-800">
            {teamCounts.employees}
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Use the sidebar to manage team, leave requests and complaints from your
        team.
      </p>
    </div>
  );
};

export default ManagerDashboard;


