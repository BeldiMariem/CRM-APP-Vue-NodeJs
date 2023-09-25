// const User that contains the return of the require,
// It comes from the file User.model
// which is whatever we assigned in the module.exports : mongoose.model('User', userSchema);
const Activity = require("../model/activity.model");
const moment = require("moment");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const _ = require('lodash');
const {
    forEach
} = require("lodash");

// Importing routes
dotenv.config();

module.exports.activityAdd = (activity) => {
    return new Promise((resolve, reject) => {
        console.log("#######", activity)
        let newActivity = new Activity(activity);
        Activity.collection.insertOne(newActivity, function (err, docs) {
            if (err) {
                reject(err);
                return console.error(err);
            } else {
                resolve(docs.ops)
                console.log("Activity inserted to Collection", docs.ops);
            }
        });
    });
}

module.exports.getActivityByAssignedUser = (assignedUser) => {
    return new Promise((resolve, reject) => {
        let activities = [];
        Activity.find({}).then(activity => {
            activity.forEach(element => {
                //console.log("element",element.activityUsers)
                let activityUsers = element.activityUsers
                activityUsers.forEach(ele => {
                    if (ele.value == assignedUser) {
                        activities.push({
                            element
                        });
                    }
                });
            });

            if (activities != []) {
                console.log("activities", activities)
                resolve(activities)
            } else {
                console.log("error")
            }
        })
    });
}

module.exports.getActivities = (idUser) => {
    return new Promise((resolve, reject) => {
        let t = []
        Activity.find({}).then(activity => {
            activity.forEach(element => {
                let activityUsers = element.activityUsers
                if (element.assignedUser == idUser) {
                    t.push({
                        element
                    })
                } else {
                    activityUsers.forEach(ele => {
                        if (ele._id == idUser) {
                            t.push({
                                element
                            });
                        }
                    });
                }
            });

            if (t != []) {
                console.log("t", t)
                resolve(t)
            } else {
                reject("Error")
                console.log("error")
            }
        })

        // Activity.find({})
        //     .then(data => {
        //         if (data) {
        //             data.forEach(ele => {
        //                 if (ele._id === idUser) {
        //                     console.log("ele._id", idUser)
        //                     t.push(ele)
        //                 } else {
        //                     console.log("@@@@@@@@@@@@@@@error")
        //                 }
        //                 ele.activityUsers.forEach(element => {
        //                     if (element._id == idUser) {
        //                         t.push(element)
        //                     }
        //                 });
        //             })
        //             if (t != []) {
        //                 console.log("t", t)
        //                 resolve(t)
        //             } else {

        //                 console.log("error")
        //             }
        //         }
        //     })

    })
};