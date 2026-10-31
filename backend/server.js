const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const binRoutes = require('./routes/binRoutes');
const seedDatabase = require('./utils/seedBins'); // 👈 Automatic Seeder Utility

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bins', binRoutes);

// Protected Admin Route Example
const { authenticate, authorizeRoles } = require('./middleware/auth');
app.get('/api/admin/dashboard', authenticate, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome to the secure Admin Dashboard!' });
});

console.log("CHECKING MONGO_URI --->", JSON.stringify(process.env.MONGO_URI));

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Atlas Connected Successfully');
  
  // 👈 Server start hote hi automatic smart bins data generate karega
  await seedDatabase();

  app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});