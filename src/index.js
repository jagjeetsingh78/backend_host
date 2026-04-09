require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const userRouter = require('./routes/users');
const testRouter = require('./routes/tests');


app.use('/users', userRouter);
app.use('/tests', testRouter);

app.get('/', (req, res) => {
  res.send('Hello from ExamPrep Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});