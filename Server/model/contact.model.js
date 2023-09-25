const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    phoneNumber: String,
    email: String,
    address: String,
    contactType: String,
    gender: String,
    dateOfBirth: Date,
    countryOfResidence: String,
    timeZone: String,
    nationality: String,
    communityLeaderGrade: String,
    agencyName: String,
    websiteLink: String,
    instagramLink: String,
    facebookLink: String,
    youTubeLink: String,
    linkedInLink: String,
    countryOfOperation: String
});

let Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact