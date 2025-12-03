## HR Management System (MERN)

A simple HR management system built with Node/Express, MongoDB, and React, using bcrypt-based login and role-based dashboards for HR (Admin), Manager, Team Lead, and Employee.

### Backend

- Location: `backend`
- Main commands:
  - `npm install`
  - `npm run seed` – resets and seeds MongoDB with sample HR, Manager, TL, and Employee users and profiles
  - `npm start` – runs API on `http://localhost:5000`

Environment variables in `backend/.env`:

- `MONGO_URI` – e.g. `mongodb://localhost:27017/hrms`
- `PORT` – e.g. `5000`

Key endpoints:

- `POST /api/auth/login` – bcrypt-checks email/password, returns user with `role` and `employeeId`
- `GET/POST/PUT/DELETE /api/users` – manage users (HR only from UI)
- `GET /api/employees`, `GET/PUT /api/employees/:id` – employee profiles
- `GET/POST/PUT/DELETE /api/departments` – department management
- `GET/POST /api/leaves`, `GET /api/leaves/by-employee/:employeeId`, `GET /api/leaves/by-approver/:approverId`, `PUT /api/leaves/:id`
- `GET/POST /api/complaints`, `GET /api/complaints/by-employee/:employeeId`, `GET /api/complaints/by-resolver/:resolverId`, `PUT /api/complaints/:id`

### Frontend

- Location: `frontend`
- Main commands:
  - `npm install`
  - `npm run dev` – runs UI on `http://localhost:5173`

The frontend talks to the backend at `http://localhost:5000/api` and keeps the logged-in user in local storage (`hrms_user`).

### Sample logins after seeding

- HR Admin: `admin@hr.com` / `password123`
- Manager: `manager0@hr.com` / `password123`
- Team Lead: `tl0@hr.com` / `password123`
- Employee: `employee0@hr.com` / `password123`

### Role dashboards

- **Admin (HR)** – `/hr` plus tabs for Staff, Departments, Leaves, Complaints, Users
- **Manager** – `/manager` with team list, team leaves, and complaints
- **Team Lead (TL)** – `/tl` with their team, leaves, and complaints views
- **Employee** – `/employee` with profile + performance, and self-service for leave and complaints

### Quick smoke test

1. Start MongoDB, then run backend (`npm start` in `backend`) and frontend (`npm run dev` in `frontend`).
2. Log in as Admin and confirm:
   - Staff tab shows Managers, TLs, and Employees in separate filters.
   - Departments tab can create/edit/delete departments.
   - Users tab can create and edit user roles.
3. Log in as Manager:
   - Team tab shows TLs/Employees.
   - Leaves tab shows team leave requests and allows approve/reject.
   - Complaints tab shows team complaints and allows status updates.
4. Log in as TL:
   - Team tab shows assigned employees.
   - Leaves/Complaints tabs show items where TL is resolver/approver.
5. Log in as Employee:
   - Dashboard shows profile & latest performance.
   - Can submit leave and complaints and see their status.


