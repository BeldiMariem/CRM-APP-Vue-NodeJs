const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    address: String,
    gender: String,
    dateOfBirth: Date,
    
});

let Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact