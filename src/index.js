require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

const { initDb } = require('./db');

// Routes
const userRoutes = require('./routes/users');
const testRouter = require('./routes/tests');
const categoriesRouter = require('./routes/categories');
const examsRouter = require('./routes/exams');
const subjectsRouter = require('./routes/subjects');
const quizzesRouter = require('./routes/quizzes');

app.use(express.json());

// ✅ Mount all routes properly
app.use('/categories', categoriesRouter);
app.use('/users', userRoutes);
app.use('/tests', testRouter);
app.use('/exams', examsRouter);
app.use('/subjects', subjectsRouter);

// 👉 FIXED (consistent naming)
app.use('/quizzes', quizzesRouter);

app.get('/', (req, res) => {
  res.send('Hello from ExamPrep Backend!');
});

initDb()
  .then(() => console.log('Database initialized successfully'))
  .catch((err) => console.warn(err.message))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });