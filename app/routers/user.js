const express = require('express');
const router = express.Router();
var User = require('../models/user'); // get our mongoose model


// route to return all users (GET http://localhost:8080/api/users)
router.get('/find', function (req, res) {
    User.find({}, function (err, users) {
        res.json(users);
    });
});

module.exports = router;