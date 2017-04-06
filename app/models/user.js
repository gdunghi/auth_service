const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: String,
    password: String,
    username: String,
    role: String,
    firstName: String,
    lastName: String
}));