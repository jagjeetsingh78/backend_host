require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { initDb } = require('./db');
const examsRouter = require('./routes/exams');
const authMiddleware = require('./Middlewares/authMiddleware');
const checkUser = require('./Middlewares/checkUser');
const subjectsRouter = require('./routes/subjects');
// Middleware
app.use(express.json());

// Import routes
const userRoutes = require('./routes/users');
const testRouter = require('./routes/tests');
const categoriesRouter = require('./routes/categories');
const verifyToken = require('./Middlewares/authMiddleware');

// Mount routes
app.use('/categories', categoriesRouter);
app.use('/users', userRoutes);
app.use('/tests', testRouter);
app.use('/exams', examsRouter);
app.use('/subjects',subjectsRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hello from ExamPrep Backend!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});


// Initialize DB (attempt) but always start server — useful for local dev
initDb()
  .then(() => console.log('Database initialized successfully'))
  .catch((err) => console.warn('Database init failed (continuing):', err.message))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  });