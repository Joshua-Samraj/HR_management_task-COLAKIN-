const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

const User = require('./models/User');
const Employee = require('./models/Employee');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const COUNTS = {
  HR: 2,
  MANAGER: 5,
  TL: 10,
  EMPLOYEE: 50,
};

const DEFAULT_PASSWORD = 'password123';

const getRandomId = (array) => {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
};

const generateHistory = (reviewerId) => {
  const hireDate = faker.date.past({ years: 5 });

  const salaryHistory = [
    {
      amount: faker.number.int({ min: 50000, max: 120000 }),
      effectiveDate: hireDate,
    },
  ];

  const performanceHistory = [
    {
      reviewDate: faker.date.recent({ days: 365 }),
      score: faker.number.float({ min: 2.5, max: 5.0, fractionDigits: 1 }),
      comments: faker.lorem.sentence(),
      reviewerId,
    },
  ];

  return { hireDate, salaryHistory, performanceHistory };
};

const importData = async () => {
  try {
    await Employee.deleteMany();
    await User.deleteMany();
    console.log('💥 Data Destroyed...'.red.inverse);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);

    console.log('Creating HRs...'.yellow);
    const hrIds = [];

    for (let i = 0; i < COUNTS.HR; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = i === 0 ? 'admin@hr.com' : `hr${i}@hr.com`;

      const user = await User.create({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: 'Admin',
      });

      const { hireDate, salaryHistory, performanceHistory } = generateHistory(
        user._id
      );

      await Employee.create({
        firstName,
        lastName,
        jobTitle: 'HR Manager',
        department: 'Human Resources',
        userId: user._id,
        hireDate,
        salaryHistory,
        performanceHistory,
      });

      hrIds.push(user._id);
    }

    console.log('Creating Managers...'.yellow);
    const managerIds = [];

    for (let i = 0; i < COUNTS.MANAGER; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const assignedHR = getRandomId(hrIds);

      const user = await User.create({
        name: `${firstName} ${lastName}`,
        email: `manager${i}@hr.com`,
        password: hashedPassword,
        role: 'Manager',
      });

      const { hireDate, salaryHistory, performanceHistory } = generateHistory(
        assignedHR
      );

      await Employee.create({
        firstName,
        lastName,
        jobTitle: 'Department Manager',
        department: faker.commerce.department(),
        userId: user._id,
        hrId: assignedHR,
        hireDate,
        salaryHistory,
        performanceHistory,
      });

      managerIds.push(user._id);
    }

    console.log('Creating Team Leaders...'.yellow);
    const tlIds = [];

    for (let i = 0; i < COUNTS.TL; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const assignedHR = getRandomId(hrIds);
      const assignedManager = getRandomId(managerIds);

      const user = await User.create({
        name: `${firstName} ${lastName}`,
        email: `tl${i}@hr.com`,
        password: hashedPassword,
        role: 'TL',
      });

      const { hireDate, salaryHistory, performanceHistory } = generateHistory(
        assignedManager
      );

      await Employee.create({
        firstName,
        lastName,
        jobTitle: 'Team Lead',
        department: 'Operations',
        userId: user._id,
        hrId: assignedHR,
        managerId: assignedManager,
        tlId: user._id,
        hireDate,
        salaryHistory,
        performanceHistory,
      });

      tlIds.push(user._id);
    }

    console.log('Creating Employees...'.yellow);
    const employees = [];

    for (let i = 0; i < COUNTS.EMPLOYEE; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const assignedHR = getRandomId(hrIds);
      const assignedManager = getRandomId(managerIds);
      const assignedTL = getRandomId(tlIds);

      const user = await User.create({
        name: `${firstName} ${lastName}`,
        email: `employee${i}@hr.com`,
        password: hashedPassword,
        role: 'Employee',
      });

      const { hireDate, salaryHistory, performanceHistory } = generateHistory(
        assignedTL
      );

      employees.push({
        firstName,
        lastName,
        jobTitle: faker.person.jobTitle(),
        department: 'Operations',
        userId: user._id,
        hrId: assignedHR,
        managerId: assignedManager,
        tlId: assignedTL,
        hireDate,
        salaryHistory,
        performanceHistory,
      });
    }

    await Employee.insertMany(employees);

    console.log('✅ All Data Imported Successfully!'.green.bold);
    console.log(`- ${COUNTS.HR} HRs`);
    console.log(`- ${COUNTS.MANAGER} Managers`);
    console.log(`- ${COUNTS.TL} Team Leads`);
    console.log(`- ${COUNTS.EMPLOYEE} Employees`);

    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Employee.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}


