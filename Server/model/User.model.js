const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    //  birthDate: Date,
    role: String,
    createdAt: Date,
    isActive: Boolean,
    lastSignOut: Date,
    updatedAt: Date,
    isConnected: Boolean,
    lastSignIn: Date,
    resetLink: String,
});


let User = mongoose.model('User', userSchema);

module.exports = User
//User.collection.dropIndex(User.firstName);