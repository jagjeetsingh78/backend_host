const express = require('express');
const router = express.Router();

// GET all users
router.get('/', (req, res) => {
    res.send(' all users');
});


router.get('Verify', (req, res) => {
   // first get the user id of the firebase 
   // then check if the user id exists in the database
   // if it exists then make id in the postgress database and return the user id to the frontend
   // if the user id does not exist in the database then return an error message to the frontend
   // if the user id of the firebase exists in the postgress then return the user id to the frontend and do not create a new user in the postgress database
});
    // GET single user
router.get('/:id', (req, res) => {
    res.send(`User ID: ${req.params.id}`);
});


router.post('/create', (req, res) => {
    try{

    }catch(err){
        res.status(500).json({ error: 'Something went wrong!' });
    }
    
});

router.put('/:id', (req, res) => {

});

module.exports = router;