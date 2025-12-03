const mongoose = require('mongoose');

const LeaveSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    approverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['Casual', 'Sick', 'Earned', 'Unpaid', 'Other'],
      default: 'Casual',
    },
    reason: String,
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    managerComment: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Leave', LeaveSchema);


