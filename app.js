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

const userRoute = require("./app/routes/user");
const authRoute = require("./app/routes/auth");
const publicRouter = require("./app/routes/public");
const port = process.env.PORT || 8081;


mongoose.connect(config.database);
app.set('superSecret', config.secret);

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use(cors({
    exposedHeaders: ["Content-disposition"]
}));

app.use("/api/public", publicRouter);

// TODO: route middleware to verify a token
app.use("/api/users", tokenVerifier.verify, userRoute);
app.use("/api/auth", tokenVerifier.verify, authRoute);

app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

module.exports = app;