const express = require('express');
const router = express.Router();
// const { initDb } = require('../db');

router.get('/', (req, res) => {
   try{

   }catch(err){
    res.status(500).json({ error: 'Something went wrong!' });
   }
});







module.exports = router;