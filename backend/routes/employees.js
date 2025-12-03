const express = require('express');
const Employee = require('../models/Employee');
const User = require('../models/User'); // Optional: If you want to verify User exists

const router = express.Router();

// ---------------------------------------------------------
// POST /api/employees
// Desc: Create a new Employee profile (Linked to an existing User ID)
// ---------------------------------------------------------
router.post('/', async (req, res) => {
  try {
    const {
      userId, // CRITICAL: You must provide the User's _id here
      firstName,
      lastName,
      jobTitle,
      department,
      hrId,
      managerId,
      tlId,
      hireDate,
      salaryHistory,
      performanceHistory
    } = req.body;

    // 1. Validation: userId is mandatory
    if (!userId) {
      return res.status(400).json({ message: 'userId is required to create an employee profile' });
    }

    // 2. Check if an Employee profile already exists for this User
    const existingEmployee = await Employee.findOne({ userId });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Employee profile already exists for this user' });
    }

    // 3. (Optional) Check if the User exists in the User collection
    // const userExists = await User.findById(userId);
    // if (!userExists) {
    //   return res.status(404).json({ message: 'User not found' });
    // }

    // 4. Create the new Employee document
    const newEmployee = await Employee.create({
      userId,
      firstName,
      lastName,
      jobTitle,
      department,
      hrId: hrId || null,         // Handle empty strings if sent from frontend
      managerId: managerId || null,
      tlId: tlId || null,
      hireDate,
      salaryHistory: salaryHistory || [],
      performanceHistory: performanceHistory || []
    });

    res.status(201).json(newEmployee);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------------------------------------
// GET /api/employees
// Desc: List employees with filters
// ---------------------------------------------------------
router.get('/', async (req, res) => {
  try {
    const { department, managerId, tlId, hrId } = req.query;
    const query = {};
    if (department) query.department = department;
    if (managerId) query.managerId = managerId;
    if (tlId) query.tlId = tlId;
    if (hrId) query.hrId = hrId;

    const employees = await Employee.find(query)
      .populate('userId', 'name email role') // Populating useful user fields
      .populate('managerId', 'firstName lastName') // usually populate Employee names, not User names, but depends on your Schema ref
      .populate('tlId', 'firstName lastName')
      .populate('hrId', 'firstName lastName');
      
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------------------------------------
// GET /api/employees/hierarchy/all
// Desc: Get organizational hierarchy
// ---------------------------------------------------------
router.get('/hierarchy/all', async (req, res) => {
  try {
    const allEmployees = await Employee.find({})
      .populate('userId')
      .populate('hrId')
      .populate('managerId')
      .populate('tlId');

    // Build hierarchy: Manager -> TLs -> Employees
    const managers = allEmployees.filter(
      (e) => e.userId?.role === 'Manager'
    );
    const tls = allEmployees.filter((e) => e.userId?.role === 'TL');
    const employees = allEmployees.filter(
      (e) => e.userId?.role === 'Employee'
    );

    const hierarchy = managers.map((manager) => {
      const managerTls = tls.filter(
        (tl) => tl.managerId?.toString() === manager.userId?._id?.toString()
      );
      const managerEmployees = employees.filter(
        (emp) =>
          emp.managerId?.toString() === manager.userId?._id?.toString() &&
          !emp.tlId
      );

      const tlWithMembers = managerTls.map((tl) => {
        const tlEmployees = employees.filter(
          (emp) => emp.tlId?.toString() === tl.userId?._id?.toString()
        );
        return {
          ...tl.toObject(),
          employees: tlEmployees,
        };
      });

      return {
        ...manager.toObject(),
        tls: tlWithMembers,
        directEmployees: managerEmployees,
      };
    });

    res.json(hierarchy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------------------------------------
// GET /api/employees/:id
// Desc: Get employee by id
// ---------------------------------------------------------
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId')
      .populate('managerId')
      .populate('tlId')
      .populate('hrId');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------------------------------------------
// PUT /api/employees/:id
// Desc: Update employee basic info
// ---------------------------------------------------------
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate('userId')
      .populate('managerId')
      .populate('tlId')
      .populate('hrId');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;