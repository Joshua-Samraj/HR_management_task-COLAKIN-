const express = require('express');
const Leave = require('../models/Leave');

const router = express.Router();

// List all leaves (for HR)
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Employee applies for leave
router.post('/', async (req, res) => {
  try {
    const leave = await Leave.create(req.body);
    res.status(201).json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leaves by employee
router.get('/by-employee/:employeeId', async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.params.employeeId,
    }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generic filter by approver (manager/HR/TL)
router.get('/by-approver/:approverId', async (req, res) => {
  try {
    const leaves = await Leave.find({
      approverId: req.params.approverId,
    }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update leave (approve/reject/cancel)
router.put('/:id', async (req, res) => {
  try {
    const leave = await Leave.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }
    res.json(leave);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


