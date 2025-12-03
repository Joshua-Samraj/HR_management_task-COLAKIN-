const express = require('express');
const Department = require('../models/Department');

const router = express.Router();

// Get all departments
router.get('/', async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create department
router.post('/', async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json(dept);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update department
router.put('/:id', async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(dept);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete department
router.delete('/:id', async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


