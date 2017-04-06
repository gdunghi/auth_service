const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/setup', function (req, res) {
    // create a sample user
    let nick = new User({
        name: 'Nick Cerminara',
        username: 'admin',
        password: 'password',
        firstName: 'Adum',
        lastName: 'smit',
        role: 'admin'
    });

    // save the sample user
    nick.save(function (err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({ success: true });
    });
});

module.exports = router;