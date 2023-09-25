// const User that contains the return of the require,
// It comes from the file User.model
// which is whatever we assigned in the module.exports : mongoose.model('User', userSchema);
const User = require("./../model/User.model");
const Role = require("../model/role.model");
const moment = require("moment");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const _ = require('lodash');
let resetToken = "";

// Set the domain to be used for sending emails
const domain = 'sandbox8e56322c5aa44da880e4cab42e95356f.mailgun.org';
// Importing routes
dotenv.config();
var mailgun = require('mailgun-js')({
    apiKey: process.env.MAILGUN_APIKEY,
    domain: domain
});

var MailComposer = require('nodemailer/lib/mail-composer');

module.exports.userAdd = (userEmail, userDepartment) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            "email": userEmail
        }).then(data => {
            if (data != undefined && data != null) {
                reject('This email already exist in the database!');
            } else {
                let constPassword = "Azerty123";
                if (userDepartment) {
                    let loginUrl = `http://localhost:8080/`;
                    let addUrl = `http://localhost:8080/`;
                    let hashedPassword = bcrypt.hashSync(constPassword, 8);
                    let newUser = new User({
                        firstName: "",
                        lastName: "",
                        email: userEmail,
                        password: hashedPassword,
                        birthDate: "",
                        role: userDepartment,
                        createdAt: moment(),
                        isActive: "false",
                        lastSignOut: moment(),
                        updatedAt: moment(),
                        isConnected: "false",
                        lastSignIn: moment(),
                        //addLink: userToken,
                    });
                    var mailOptions = {
                        from: 'you@samples.mailgun.org',
                        subject: 'Welcome to WanToTrip crm!',
                        //html: "Here your access link to login : <a href=" + loginUrl + "> " + loginUrl + " </a>"
                        html: "Hello \n Welcome to WanToTrip CRM <br />  Your email address :  " + userEmail + "<br/>  Your password : " + constPassword + " <br/>  Here your access link to login : <a href=" + loginUrl + "> " + loginUrl + " </a> \n Best Regards."
                    };
                    var mail = new MailComposer(mailOptions);
                    newUser.save(function (err, docs) {
                        if (err) {
                            reject(err);
                        } else {
                            mail.compile().build((err, message) => {
                                var dataToSend = {
                                    to: userEmail,
                                    message: message.toString('ascii')
                                };
                                mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                                    if (sendError) {
                                        reject(sendError)
                                        return;
                                    } else {
                                        resolve(body)
                                    }
                                });
                            });
                            resolve(newUser)

                        }
                    });
                } else {
                    reject("This role does not exist. Please enter a valid one!")
                }
            }
        });
    });
}

// module.exports.userAdd = (userEmail, userDepartment) => {
//     return new Promise((resolve, reject) => {
//         User.findOne({
//             "email": userEmail
//         }).then(data => {
//             if (data != undefined && data != null) {
//                 reject('This email already exist in the database!');
//             } else {
//                 let constPassword = "Azerty123";
//                 // User does not exist therefore we can insert new user, load the payload with email, insert user and send email
//                 if (userDepartment) {
//                     Role.findOne({
//                         "department": userDepartment
//                     }).then(role => {
//                         console.log("role", role)
//                         if (role) {
//                             let payload = {
//                                 email: userEmail,
//                                 password: constPassword
//                             };















//                             console.log("check payload", payload)
//                             userToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
//                                 expiresIn: 86400
//                             });
//                             //let addUrl = `http://localhost:8080/login/${userToken}`;
//                             let addUrl = `http://localhost:8080/login/${userToken}`;
//                             let hashedPassword = bcrypt.hashSync(constPassword, 8);
//                             let newUser = new User({
//                                 firstName: "",
//                                 lastName: "",
//                                 email: userEmail,
//                                 password: hashedPassword,
//                                 birthDate: "",
//                                 role: role,
//                                 createdAt: moment(),
//                                 isActive: "false",
//                                 lastSignOut: moment(),
//                                 updatedAt: moment(),
//                                 isConnected: "false",
//                                 lastSignIn: moment(),
//                                 addLink: userToken,
//                             });
//                             var mailOptions = {
//                                 from: 'you@samples.mailgun.org',
//                                 subject: 'Welcome to Wantotrip crm!',
//                                 ///  html: '<p>Click <a href="http://localhost:8080/"> here</a> to reset your password</p>'
//                                 html: "Hello \n Welcome to WanToTrip CRM <br />  Your email address :  " + userEmail + "<br/>  Your password : " + constPassword + " <br/>  Here your access link to login : <a href=" + addUrl + "> " + addUrl + " </a> \n Best Regards."
//                             };
//                             var mail = new MailComposer(mailOptions);
//                             User.collection.insertOne(newUser, function (err, docs) {
//                                 if (err) {
//                                     reject(err);
//                                 } else {
//                                     mail.compile().build((err, message) => {
//                                         var dataToSend = {
//                                             to: userEmail,
//                                             message: message.toString('ascii')
//                                         };
//                                         mailgun.messages().sendMime(dataToSend, (sendError, body) => {
//                                             if (sendError) {
//                                                 reject(sendError)
//                                                 console.log(sendError);
//                                                 return;
//                                             } else {
//                                                 reject(body)
//                                             }
//                                         });
//                                     });
//                                     resolve(docs.ops)
//                                     console.log("Document inserted to Collection", docs.ops);
//                                 }
//                             });
//                         } else {
//                             reject("This role does not exist. Please enter a valid one!")
//                         }
//                     })
//                 } else {
//                     reject("Please enter a department name")
//                 }
//             }
//         });
//     });
// }

module.exports.register = (addUser, addLink) => {
    return new Promise((resolve, reject) => {
        console.log("@@@@@@@", addUser)
        if (addLink) {
            jwt.verify(addLink, process.env.TOKEN_SECRET, function (err, decoded) {
                console.log("resetttttttttttttttt", addLink);
                //console.log("resetttttttttttttttt",newPassword);
                if (err) {
                    reject(err);
                }
                User.findOne({
                        "addLink": addLink
                    })
                    .then(user => {
                        if (user != undefined && user != null) {
                            console.log("The user found after searching:", user);
                            // email the user with the link to reset the password
                            const data = {
                                from: 'noreply@hello.com',
                                to: user.email,
                                subject: 'Register',
                                html: `
                                <h2>User got registered successfully</h2>
                            `
                            };
                            var hashedPassword = bcrypt.hashSync(addUser.password, 8);
                            // In case we found user with the reset link token
                            user.updateOne({
                                firstName: addUser.firstName,
                                lastName: addUser.lastName,
                                birthDate: addUser.birthDate,
                                password: hashedPassword,
                                addLink: " "
                            }, function (err, success) {
                                if (err) {
                                    reject('error while updating the add link');
                                } else {
                                    // if reset password link is success then send email
                                    mg.messages().send(data, function (error) {
                                        if (error) {
                                            reject(error);
                                        } else {
                                            resolve('Congrats! Your data Got Updated')
                                        }
                                    });
                                }
                            });
                        } else {
                            reject('This user does not exist!');
                        }
                    }).catch(err => {
                        reject(err);
                    })
            });
        } else {
            reject('error the add token link!');
        }
    });
}

// Function for registration new user
// module.exports.register = (user) => {
//     return new Promise((resolve, reject)=>{
//         User.findOne({"email": user.email}).then(data=>{
//             console.log("dataaaaaaaaaa",data);
//             if(data != undefined && data != null){
//                 reject('This email already exists!');
//             }else{
//                 let newUser = new User(user);
//                 var hashedPassword = bcrypt.hashSync(newUser.password, 8);
//                 // Inserting the data that will not be available in front end
//                 newUser.password = hashedPassword;
//                 newUser.role = "role";
//                 newUser.createdAt = moment();
//                 newUser.isActive = "false";
//                 newUser.lastSignOut = moment();
//                 newUser.updatedAt = moment();
//                 newUser.isConnected = "false";
//                 newUser.lastSignIn = moment();
//                 newUser.save((err, res) =>{
//                     if(err){
//                         reject(err);
//                         console.log("****User not saved + error****",err);
//                     }else{
//                         resolve(res);
//                         console.log("****Success user saved!****",res);
//                     }
//                 });

//             }
//         });
//     });
// }
// Function for login user: search for the email and password
module.exports.login = (userEmail, userPassword) => {
    return new Promise((resolve, reject) => {
        User.findOne({
                "email": userEmail
            })
            .then(u => {
                console.log("The user found after searching:", u);
                if (u != undefined && u != null) {
                    // User found then let's check email!
                    let passwordCheck = bcrypt.compareSync(userPassword, u.password);
                    console.log("Password Check", passwordCheck);
                    if (passwordCheck) {
                        let payload = {
                            idUser: u._id
                        };
                        var token = jwt.sign(payload, process.env.TOKEN_SECRET, {
                            expiresIn: 86400
                        });
                        resolve({
                            token: token,
                            user: u
                        });
                    } else {
                        reject('This password is incorrect')
                    }
                } else {
                    reject('This email is incorrect!')
                }
            })
    });
};

// The purpose of this function is to send an email to the user when they trigger the forget password button  and to set a property resetLink with the new token
module.exports.forgotPassword = (userEmail) => {
    return new Promise((resolve, reject) => {
        User.findOne({
                "email": userEmail
            })
            .then(u => {
                if (u != undefined && u != null) {
                    let payload = {
                        email: u.email
                    };
                    resetToken = jwt.sign(payload, process.env.RESET_PASSWORD_KEY, {
                        expiresIn: 86400
                    });
                    let resetUrl = `http://localhost:8080/resetPassword/${resetToken}`;
                    var mailOptions = {
                        from: 'WanToTripTeam@gmail.com',
                        subject: 'Your reset password link!',
                        html: "Here your access link to login : <a href=" + resetUrl + "> " + resetUrl + " </a>"
                        //  html: `We have received your request to change your WanToTrip account password. Please click the button bellow to reset it <a href='${resetUrl}'>${resetUrl}</a>`
                    };
                    var mail = new MailComposer(mailOptions);
                    u.updateOne({
                        resetLink: resetToken
                    }, function (err, success) {
                        if (err) {
                            reject('reset password link error');
                        } else {
                            // if reset password link is success then send email
                            mail.compile().build((err, message) => {
                                var dataToSend = {
                                    to: userEmail,
                                    message: message.toString('ascii')
                                };
                                mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                                    if (sendError) {
                                        reject(sendError)
                                        return;
                                    } else {
                                        resolve('Email has been sent! Follow the instructions', resetToken)
                                    }
                                });
                            });
                        }
                    });
                } else {
                    reject('This user does not exist!');
                }
            })
    });
};

// creating new func resetPassword that accepts the reset link and new password
// module.exports.resetPassword = (user, resetLink, newPassword) => {
//       return new Promise((resolve, reject) => {
//           if(resetLink){
//              jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY, function(err, decoded) {
//                 //console.log("resetttttttttttttttt",resetLink);
//                 //console.log("resetttttttttttttttt",newPassword);
//                 if (err){
//                     reject(err);
//                 }
//                  User.findOne({"resetLink": user.resetLink})
//                 .then(u => {
//                     if(u != undefined && u != null){
//                         console.log("The user found after searching:",u);
//                          // email the user with the link to reset the password
//                         const data = {
//                             from: 'noreply@hello.com',
//                             to: u.email,
//                             subject: 'Password Reset Successfully',
//                             html:`
//                                 <h2>Your password got reset successfully</h2>
//                             `
//                         };
//                         var hashedPassword = bcrypt.hashSync(newPassword, 8);
//                         // In case we found user with the reset link token
//                         u.updateOne({password: hashedPassword, resetLink: " "}, function(err, success){
//                             if(err){
//                                 reject('error while updating the password');
//                             }else{
//                                 // if reset password link is success then send email
//                                 mg.messages().send(data, function(error) {
//                                     if(error){
//                                         reject(error);
//                                     }else{
//                                         resolve('Congrats! Your Password Got Updated')
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                     else {
//                         reject('This user does not exist!');
//                     }
//                 }).catch(err =>{ reject(err);})
//               });
//           }else{
//               reject('error the reset token link!');
//           }
//     });
// };
module.exports.resetPasswordFirst = (idUser, newPassword, confirmPassword) => {
    return new Promise((resolve, reject) => {
        User.findOne({
                "_id": idUser
            })
            .then(u => {
                if (u != undefined && u != null) {
                    if (newPassword === confirmPassword) {
                        var hashedPassword = bcrypt.hashSync(newPassword, 8);
                        u.updateOne({
                            password: hashedPassword
                        }, function (err, success) {
                            if (err) {
                                reject('Error while updating the password');
                            } else {
                                resolve("Password updated successfully.")
                            }
                        });
                    } else {
                        reject("Password does not match. Please check again.")
                    }
                } else {
                    reject('This user does not exist in the db!');
                }
            }).catch(err => {
                reject(err);
            })

    });
};

module.exports.resetPassword = (userEmail, newPassword, confirmPassword) => {
    return new Promise((resolve, reject) => {
        User.findOne({
                "email": userEmail
            })
            .then(u => {
                let loginUrl = `http://localhost:8080/`;
                if (u != undefined && u != null) {
                    var mailOptions = {
                        from: 'WanToTripTeam@gmail.com',
                        subject: 'Password reset!',
                        html: "Here your access link to login : <a href=" + loginUrl + "> " + loginUrl + " </a>"
                    };
                    var mail = new MailComposer(mailOptions);
                    if (newPassword === confirmPassword) {
                        var hashedPassword = bcrypt.hashSync(newPassword, 8);
                        u.updateOne({
                            password: hashedPassword
                        }, function (err, success) {
                            if (err) {
                                reject('Error while updating the password');
                            } else {
                                mail.compile().build((err, message) => {
                                    var dataToSend = {
                                        to: userEmail,
                                        message: message.toString('ascii')
                                    };
                                    mailgun.messages().sendMime(dataToSend, (sendError, body) => {
                                        if (sendError) {
                                            reject(sendError)
                                            return;
                                        } else {
                                            resolve('Email sent and password got updated successfully!')
                                        }
                                    });
                                });
                            }
                        });
                    } else {
                        reject("Password does not match. Please check again.")
                    }
                } else {
                    reject('This user does not exist in the db!');
                }
            }).catch(err => {
                reject(err);
            })

    });
};

module.exports.updateProfile = (idUser, userNewData) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            _id: idUser
        }, {
            password: 0
        }, function (err, user) {
            if (user == undefined && user == null) {
                reject('No user found.');
            } else {
                //console.log("@@@@@@@@@@@@ user found via find one and the email", user);
                User.findOneAndUpdate({
                    _id: user._id
                }, userNewData, {
                    new: true,
                    useFindAndModify: false
                }, (error, updateResult) => {
                    if (updateResult) {
                        resolve(updateResult);
                        //console.log("USER UPDATES +RESULT ", updateResult);
                    } else {
                        reject('There was a problem!')
                        console.log("Something wrong when updating data!", error);
                    }
                });

            }
        });
    });
}

module.exports.updatePassword = (userId, currentPassword, newPassword) => {
    return new Promise((resolve, reject) => {

        if (newPassword && currentPassword) {
            User.findOne({
                    "_id": userId
                })
                .then(u => {
                    if (u != undefined && u != null) {
                        if (bcrypt.compareSync(currentPassword, u.password)) {
                            // Passwords match
                            console.log("Password matches!")
                            var hashedPassword = bcrypt.hashSync(newPassword, 8);
                            u.updateOne({
                                password: hashedPassword
                            }, function (err, success) {
                                if (err) {
                                    reject('error while updating the password');
                                } else {
                                    resolve("Password got updated")
                                }
                            });

                        } else {
                            // Passwords don't match
                            //console.log("Password doesn't match!")
                            reject("Password doesn't match!")
                        }
                    } else {
                        reject('This user does not exist in the db!');
                    }
                }).catch(err => {
                    reject(err);
                })

        } else {
            reject("New password is required")
        }
    });
};

module.exports.verifyPassword = (userId, currentPassword) => {
    return new Promise((resolve, reject) => {
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@ from back end : userId", userId)
        // console.log("@@@@@@@@@@@@@@@@@@@@@@@@ from back end :  currentPassword", currentPassword)
        // // console.log("@@@@@@@@@@@@@@@@@@@@@@@@ from back end : userId", newPassword)
        User.findOne({
                "_id": userId
            })
            .then(u => {
                if (u != undefined && u != null) {
                    if (bcrypt.compareSync(currentPassword, u.password)) {
                        // Passwords match
                        //console.log("Password matches!")
                        resolve("Password matches!")
                    } else {
                        // Passwords don't match
                        //console.log("Password doesn't match!")
                        reject("Password doesn't match!")
                    }
                } else {
                    reject('This user does not exist in the db!');
                }
            }).catch(err => {
                reject("Error in verify password!", err);
            })


    });
};



/**
 * 
 * 
 * 
 * User.findOne({
         "resetLink": user.resetLink
     })
     .then(u => {
         if (u != undefined && u != null) {
             console.log("The user found after searching:", u);
             // email the user with the link to reset the password
             const data = {
                 from: 'noreply@hello.com',
                 to: u.email,
                 subject: 'Password Reset Successfully',
                 html: `
            <h2>Your password got reset successfully</h2>
        `
             };
             // var hashedPassword = bcrypt.hashSync(newPassword, 8);
             // In case we found user with the reset link token
             u.updateOne({
                 password: hashedPassword,
                 resetLink: " "
             }, function (err, success) {
                 if (err) {
                     reject('error while updating the password');
                 } else {
                     // if reset password link is success then send email
                     mg.messages().send(data, function (error) {
                         if (error) {
                             reject(error);
                         } else {
                             resolve('Congrats! Your Password Got Updated')
                         }
                     });
                 }
             });
         } else {
             reject('This user does not exist!');
         }
     }).catch(err => {
         reject(err);
     })
 */