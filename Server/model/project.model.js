const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String
    },
    value: {
        type: Number
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

let Project = mongoose.model('Project', projectSchema);
module.exports = Project
