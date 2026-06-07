const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/userModel');

dotenv.config();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let adminSeeded = false;

const seedAdmin = async () => {
  const adminCount = await User.countDocuments();
  if (adminCount === 0) {
    console.log('No user accounts detected. Seeding default Admin user...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';
    const adminUsername = process.env.ADMIN_USERNAME || 'Blog Admin';

    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
    });
    console.log('Default Admin seeded successfully!');
  }
};

const ensureDb = async (req, res, next) => {
  if (!process.env.MONGO_URI) {
    return res.status(503).json({
      message: 'MONGO_URI environment variable is not configured on the server.',
    });
  }

  try {
    await connectDB();
    if (!adminSeeded) {
      adminSeeded = true;
      await seedAdmin();
    }
    next();
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    res.status(503).json({ message: 'Database connection failed. Check MONGO_URI and Atlas network access.' });
  }
};

app.get('/', (req, res) => {
  res.send('Personal Blog API is running...');
});

app.use('/api/auth', ensureDb, require('./routes/authRoutes'));
app.use('/api/posts', ensureDb, require('./routes/postRoutes'));
app.use('/api/comments', ensureDb, require('./routes/commentRoutes'));

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) {
  connectDB()
    .then(() => seedAdmin())
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running in development mode on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error(`Failed to start server: ${error.message}`);
      process.exit(1);
    });
}

module.exports = app;
