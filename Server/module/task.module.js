const taskModel = require("../model/task.model");
const dotenv = require('dotenv');
const _ = require('lodash');

// Importing routes
dotenv.config();

module.exports.taskAdd = (task) => {
    return new Promise((resolve, reject) => {
        let newTask = new taskModel(task);
        taskModel.collection.insertOne(newTask, function (err, docs) {
            if (err) {
                reject(err);
                return console.error(err);
            } else {
                resolve(docs.ops)
                console.log("Task inserted to Collection", docs.ops);
            }
        });
    });
}

module.exports.getTasks = () => {
    return new Promise((resolve, reject) => {
        taskModel.find({}).then(projectSearched => {
            if (projectSearched != undefined && projectSearched != null) {
                resolve(projectSearched)
            } else {
                
                reject("No Project were found in db!")
            }
        })
    });
}

module.exports.getTasksByProjectId = (projectId) => {
    return new Promise((resolve, reject) => {
        let tasks = [];
        taskModel.find({}).then(task => {
            task.forEach(element => {
                if (element.project == projectId) {
                    tasks.push({
                        element
                    });
                }
            });
            if (tasks != []) {
                console.log("tasks", tasks)
                resolve(tasks)
            } else {
                console.log("error")
            }
        })
    });
}