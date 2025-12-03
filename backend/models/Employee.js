const mongoose = require('mongoose');

const SalaryHistorySchema = new mongoose.Schema(
  {
    amount: Number,
    effectiveDate: Date,
  },
  { _id: false }
);

const PerformanceHistorySchema = new mongoose.Schema(
  {
    reviewDate: Date,
    score: Number,
    comments: String,
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { _id: false }
);

const EmployeeSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    jobTitle: String,
    department: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    hrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    tlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    hireDate: Date,
    salaryHistory: [SalaryHistorySchema],
    performanceHistory: [PerformanceHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', EmployeeSchema);


