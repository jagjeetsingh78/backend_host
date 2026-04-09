const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    res.send(' all users');
});

// GET single user
router.get('/:id', (req, res) => {
    res.send(`User ID: ${req.params.id}`);
});

// POST create user
router.post('/', (req, res) => {
    res.send('User Created');
});

module.exports = router;