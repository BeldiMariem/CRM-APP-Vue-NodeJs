const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String
    },
    project: {
        type: String
    },
    description: {
        type: String
    },
    status: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    }
});

let Task = mongoose.model('Task', taskSchema);
module.exports = Task
