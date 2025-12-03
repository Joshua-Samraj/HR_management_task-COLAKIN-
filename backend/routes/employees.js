const express = require('express');
const Employee = require('../models/Employee');

const router = express.Router();

// List employees with filters: role (from linked user), department, managerId, tlId, hrId
router.get('/', async (req, res) => {
  try {
    const { department, managerId, tlId, hrId } = req.query;
    const query = {};
    if (department) query.department = department;
    if (managerId) query.managerId = managerId;
    if (tlId) query.tlId = tlId;
    if (hrId) query.hrId = hrId;

    const employees = await Employee.find(query)
      .populate('userId')
      .populate('managerId', 'name email')
      .populate('tlId', 'name email')
      .populate('hrId', 'name email');
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get employee by id
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('userId')
      .populate('managerId', 'name email')
      .populate('tlId', 'name email')
      .populate('hrId', 'name email');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update employee basic info
router.put('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate('userId')
      .populate('managerId', 'name email')
      .populate('tlId', 'name email')
      .populate('hrId', 'name email');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get organizational hierarchy
router.get('/hierarchy/all', async (req, res) => {
  try {
    const allEmployees = await Employee.find({})
      .populate('userId')
      .populate('hrId', 'name email')
      .populate('managerId', 'name email')
      .populate('tlId', 'name email');

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

module.exports = router;


