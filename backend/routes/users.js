const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Employee = require('../models/Employee');

const router = express.Router();

// Get all users, optional role filter
router.get('/', async (req, res) => {
  try {
    const { role } = req.query;
    const query = {};
    if (role) query.role = role;
    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user (and optional employee profile)
router.post(
  '/',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 4 }),
    body('role').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, email, password, role, employee } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        password: hashed,
        role,
      });

      let employeeDoc = null;
      if (employee) {
        employeeDoc = await Employee.create({
          ...employee,
          userId: user._id,
        });
      }

      res.status(201).json({
        user,
        employee: employeeDoc,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update user basic info and role
router.put('/:id', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user and linked employee
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await Employee.deleteMany({ userId: user._id });
    res.json({ message: 'User and related employee deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


