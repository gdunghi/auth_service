const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.post('/authenticate', function (req, res) {
    // find the user
    User.findOne({
        username: req.body.username
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {

                let token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 + 60),
                    data: {
                        name: user.name,
                        role: user.role
                    }
                }, app.get('superSecret'), {
                        //expiresInMinutes: 1440 // expires in 24 hours
                    });

                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});


router.get('/verify/:token', function (req, res) {
    let token = req.params.token;
    let decoded = jwt.verify(token, app.get('superSecret'));
    res.json(decoded);
});


module.exports = router;