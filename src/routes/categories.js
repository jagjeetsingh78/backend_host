const express = require('express');
const router = express.Router();
// const { initDb } = require('../db');

router.get('/', (req, res) => {
    res.send(' all categories');
});







module.exports = router;