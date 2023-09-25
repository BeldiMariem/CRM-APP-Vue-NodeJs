const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    department:{
        type: String
    },
    roleFunctionalities: {
        type: Object
    }
});

let Role = mongoose.model('Role', roleSchema);
module.exports = Role