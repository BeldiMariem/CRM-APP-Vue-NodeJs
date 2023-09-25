const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
    title: {
        type: String
    },
    contact: {
        type: String
    },
    value: {
        type: Number
    },
    status: {
        type: String
    },
    stage: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});

let Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal