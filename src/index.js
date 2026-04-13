require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const { initDb } = require('./db');
const examsRouter = require('./routes/exams');

// Middleware
app.use(express.json());

// Import routes
const userRouter = require('./routes/users');
const testRouter = require('./routes/tests');
const categoriesRouter = require('./routes/categories');

// Mount routes
app.use('/categories', categoriesRouter);
app.use('/users', userRouter);
app.use('/tests', testRouter);
app.use('/exams', examsRouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hello from ExamPrep Backend!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log('Database is ready');
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });