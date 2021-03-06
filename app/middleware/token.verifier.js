"use strict";
const jwt = require("jsonwebtoken");
const config = require('../../config'); // get our config file
let verify = (req, res, next) => {

    let token = req.headers['x-auth-token'];
    if (token) {
        try {
            let payload = jwt.verify(token, config.secret);
            req.headers.token = payload;
            next();
        } catch (ex) {
            console.log(ex);
            sendStatus401(res);
        }
    } else {
        sendStatus401(res);
    }
};

function sendStatus401(res) {
    res.status(401).send("");
}

module.exports = {
    verify: verify
};
