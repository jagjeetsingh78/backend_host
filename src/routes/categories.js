const express = require('express');
const router = express.Router();
// const { initDb } = require('../db');

router.get('/', (req, res) => {
    res.send(' all categories');
});

// router.get('/check', (req, res) => {
//     const { sql } = require('../db');
//     sql`
//         SELECT * FROM exams;
//     `
//     .then(result => {
//         res.json(result);
//     })
//     .catch(error => {
//         console.error('Error fetching categories:', error);
//         res.status(500).json({ error: 'Failed to fetch categories' });
//     });
// });





module.exports = router;