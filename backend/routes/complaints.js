const express = require('express');
const Complaint = require('../models/Complaint');

const router = express.Router();

// List all complaints (for HR)
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create complaint
router.post('/', async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complaints by employee
router.get('/by-employee/:employeeId', async (req, res) => {
  try {
    const complaints = await Complaint.find({
      employeeId: req.params.employeeId,
    })
      .populate('againstId', 'name email')
      .populate('resolverId', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complaints by resolver (manager/HR/TL)
router.get('/by-resolver/:resolverId', async (req, res) => {
  try {
    const complaints = await Complaint.find({
      resolverId: req.params.resolverId,
    }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status / resolution
router.put('/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    res.json(complaint);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


