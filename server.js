const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const cors = require("cors");
const tokenVerifier = require("./app/middleware/token.verifier");

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('./config'); // get our config file
const User = require('./app/models/user'); // get our mongoose model
const apiRoutes = express.Router();

const userRoute = require("./app/routes/user");

let port = process.env.PORT || 8081;
mongoose.connect(config.database);
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.use(cors({
    exposedHeaders: ["Content-disposition"]
}));


// TODO: route middleware to verify a token
app.use("/api/users", tokenVerifier.verify, userRoute);

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

app.get('/setup', function (req, res) {

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


apiRoutes.post('/authenticate', function (req, res) {
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

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the coolest API on earth!' });
});

apiRoutes.get('/verify/:token', function (req, res) {
    let token = req.params.token;
    let decoded = jwt.verify(token, app.get('superSecret'));
    res.json(decoded);
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);