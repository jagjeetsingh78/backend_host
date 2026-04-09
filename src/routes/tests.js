const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(' all tests');
});

module.exports = router;