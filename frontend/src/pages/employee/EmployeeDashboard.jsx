import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../state/AuthContext';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (!user?.employeeId) return;
      try {
        const res = await api.get(`/employees/${user.employeeId}`);
        setProfile(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [user]);

  if (!user?.employeeId) {
    return (
      <div className="p-6">
        <p className="text-sm text-slate-600">
          No employee profile linked to this user.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold text-slate-800">
        My Dashboard
      </h2>
      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Profile
            </h3>
            <p className="text-sm text-slate-700">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="text-sm text-slate-700">
              {profile.jobTitle} • {profile.department}
            </p>
            {profile.hireDate && (
              <p className="text-xs text-slate-500">
                Hired on {new Date(profile.hireDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Latest Performance
            </h3>
            {profile.performanceHistory &&
            profile.performanceHistory.length > 0 ? (
              <div className="text-sm text-slate-700">
                <p>
                  Score:{' '}
                  <span className="font-semibold">
                    {
                      profile.performanceHistory[
                        profile.performanceHistory.length - 1
                      ].score
                    }
                  </span>
                </p>
                <p className="text-xs text-slate-500">
                  Reviewed on{' '}
                  {new Date(
                    profile.performanceHistory[
                      profile.performanceHistory.length - 1
                    ].reviewDate
                  ).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No performance reviews yet.
              </p>
            )}
          </div>
        </div>
      )}
      <p className="text-sm text-slate-600">
        Use the sidebar to apply for leave, submit complaints, and view your
        history.
      </p>
    </div>
  );
};

export default EmployeeDashboard;


