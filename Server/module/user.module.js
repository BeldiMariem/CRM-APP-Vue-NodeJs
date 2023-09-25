const dotenv = require('dotenv');
const User = require("../model/User.model");
const Role = require("../model/role.model");
const moment = require("moment");
const jwt = require('jsonwebtoken');
// const mailgun = require("mailgun-js");
const domain = 'sandbox8e56322c5aa44da880e4cab42e95356f.mailgun.org';
const bcrypt = require("bcrypt");

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
        // User does not exist therefore we can insert new user, load the payload with email, insert user and send email
        if (userDepartment) {
          Role.findOne({
            "department": userDepartment
          }).then(role => {
            console.log("role", role)
            if (role) {
              // let payload = {
              //   email: userEmail,
              //   password: constPassword
              // };
              // console.log("check payload", payload)
              // userToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
              //   expiresIn: 86400
              // });
              //let addUrl = `http://localhost:8080/login/${userToken}`;
              let addUrl = `http://localhost:8080/login/${userToken}`;
              let hashedPassword = bcrypt.hashSync(constPassword, 8);
              let newUser = new User({
                firstName: "",
                lastName: "",
                email: userEmail,
                password: hashedPassword,
                birthDate: "",
                role: role,
                createdAt: moment(),
                isActive: "false",
                lastSignOut: moment(),
                updatedAt: moment(),
                isConnected: "false",
                lastSignIn: moment(),
                addLink: userToken,
              });
              var mailOptions = {
                from: 'you@samples.mailgun.org',
                subject: 'Welcome to Wantotrip crm!',
                ///  html: '<p>Click <a href="http://localhost:8080/"> here</a> to reset your password</p>'
                html: "Hello \n Welcome to WanToTrip CRM <br />  Your email address :  " + userEmail + "<br/>  Your password : " + constPassword + " <br/>  Here your access link to login : <a href=" + addUrl + "> " + addUrl + " </a> \n Best Regards."
              };
              var mail = new MailComposer(mailOptions);
              User.collection.insertOne(newUser, function (err, docs) {
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
                        console.log(sendError);
                        return;
                      } else {
                        reject(body)
                      }
                    });
                  });
                  resolve(docs.ops)
                  console.log("Document inserted to Collection", docs.ops);
                }
              });
            } else {
              reject("This role does not exist. Please enter a valid one!")
            }
          })
        } else {
          reject("Please enter a department name")
        }
      }
    });
  });
}

// Function that send a link to the email address entered : Link will redirect to the register page
module.exports.userAddLink = (userEmail) => {
  return new Promise((resolve, reject) => {
    User.findOne({
        "email": userEmail
      })
      .then(u => {
        console.log("###############", u);
        if (u != undefined && u != null) {
          let payload = {
            email: u.email
          };
          // generating new token
          userToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            expiresIn: 86400
          });
          console.log("resetTokenresetTokenresetTokenresetTokenresetTokenresetTokenresetToken", userToken)
          // email the user with the login into the account
          let addUrl = 'http://localhost:8080/login';
          const data = {
            from: 'noreply@hello.com',
            to: userEmail,
            subject: 'Login to WanToTrip Account',
            html: `
                        <p>Be changed later.</p>
                        <a href='${addUrl}'>${addUrl}</a>
                    `
          };
          // Update the user restLink property
          u.updateOne({
            addLink: userToken
          }, function (err, success) {
            if (err) {
              reject('add link error');
            } else {
              // if reset password link is success then send email
              mg.messages().send(data, function (error, body) {
                if (error) {
                  reject('error');
                } else {
                  resolve('Email has been sent! Follow the instructions', userToken)
                }
              });
            }
          });
        } else {
          reject('This user does not exist!');
        }
      })
  });
};

module.exports.updateProfileUser = (idUser, role) => {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({
      _id: idUser
    }, {
      "role": role
    }, {
      useFindAndModify: false
    }, (error, updateResult) => {
      if (updateResult) {
        resolve(updateResult);
      } else {
        reject('This User Does Not Exist.')
      }
    });
  })
}