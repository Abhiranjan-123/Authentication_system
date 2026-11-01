const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const authRoutes = require('./routes/authRoutes');
const binRoutes = require('./routes/binRoutes');
const seedDatabase = require('./utils/seedBins'); // Automatic Seeder Utility

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Robust CORS Configuration (Handles trailing slashes, Vercel frontend, and local dev)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL?.replace(/\/$/, ""), // Removes trailing slash if present
  "https://authenticationsystem-frontend-zna4.vercel.app",
  "http://localhost:3000"
].filter(Boolean); // Removes undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

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

// Database Connection & Server Start
mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('MongoDB Atlas Connected Successfully');
  
  // Automatic smart bins data generator on server boot
  await seedDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});
