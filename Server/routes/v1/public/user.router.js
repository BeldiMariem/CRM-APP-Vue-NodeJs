const router = require('express').Router();
// The return of the require contains the the register function assigned in authModule
const userModule = require('../../../module/user.module');
const response = require('ybha-response');
const dotenv = require('dotenv');
const User = require("../../../model/User.model");
const Role = require("../../../model/role.model");
const bcrypt = require("bcrypt");
const verify = require("../../../middleware/verifyLoginToken");



// router.post('/updateUser', verify, (req, res) => {
//   console.log("tokennn check verii ", req.user._id)
//   idUser = req.params.idUser;
//   User.findByIdAndUpdate(req.user._id, {
//     role: req.body.role
//   }, {
//     useFindAndModify: false
//   }, function (err, data) {
//     if (err) {
//       return response.badRequest("err");
//     } else {
//       //res.send("Data updated!");
//       //return response.json(data);
//       User.find({
//           _id: data._id
//         })
//         .populate("role")
//         .exec(function (error, role) {
//           console.log("Data updated!", role);
//           res.json(role)
//         })
//     }
//   });
// });
router.get('/deleteUser/:idUser', (req, res) => {
  idUser = req.params.idUser;
  console.log("60915d1f5ce09912885314ca", req.params.idUser)
  User.findByIdAndDelete(idUser, function (err, docs) {
    if (err) {
      response.badRequest(res, err);
      console.log(err)
    } else {
      response.json(res, docs)
      console.log("Deleted : ", docs);
    }
  });
});
router.put('/userAddLink', (req, res) => {
  let userEmail = req.body.email;
  userModule.userAddLink(userEmail).then(data =>
    response.json(res, data)
  ).catch(err => {
    response.badRequest(res, err);
  })
});
router.get('/findUsersById/:idUser', (req, res) => {
  idUser = req.params.idUser;
  console.log("test", req.params.idUser)
  User.find({
      "_id": idUser
    })
    .populate("role")
    .exec(function (error, role) {
      res.json(role)
    })
  // User.findOne({
  //   "_id": idUser
  // }).then(u => {
  //   response.json(res, u)
  // });
});
router.get('/findUsersByEmail/:email/:password', (req, res) => {
  email = req.params.email;
  password = req.params.password;
  return new Promise((resolve, reject) => {
    User.findOne({
        "email": email
      })
      .then(u => {
        if (u != undefined && u != null) {
          let passwordCheck = bcrypt.compareSync(password, u.password);
          if (passwordCheck) {
            res.json(u)
          } else {
            res.json('This password is incorrect')
          }
        } else {
          res.json('This email is incorrect!')
        }
      })
  });
  // User.find({
  //   "email": email
  // }).then(u => {
  //   if (u != undefined && u != null) {
  //     let passwordCheck = bcrypt.compareSync(password, u.password);
  //     console.log("Password Check", passwordCheck);
  //   }

  // })
  // .populate("role")
  // .exec(function (error, role) {
  //   if (role) {

  //     res.json(role);

  //   }

  // })


  // User.findOne({
  //   "_id": idUser
  // }).then(u => {
  //   response.json(res, u)
  // });
});
router.post('/updateProfileUser/:idUser', verify, (req, res) => {
  let userNewRole = req.body.role;
  let idUser = req.params.idUser;
  if (idUser) {
    userModule.updateProfileUser(idUser, userNewRole).then((data) => {
        if (data) {
          User.find({
              _id: data._id
            })
            .populate("role")
            .exec(function (error, role) {
              res.json(role)
            })
        }
        //response.json(res, data);
      })
      .catch(err => {
        response.badRequest(res, err);
      });
  } else {
    response.badRequest('Please enter a user id');
  }
});
// router.post('/updateProfileUser/:idUser', verify, (req, res) => {
//   console.log("tokennn check verii ", req.user.idUser)
//   console.log("tokennn check verii ", req.params.idUser)
//   console.log("tokennn check verii ", req.body)
//   idUser = req.params.idUser;
//   User.findByIdAndUpdate(idUser,
//     req.body.role, {
//       useFindAndModify: false
//     },
//     function (err, data) {
//       if (err) {
//         console.log("Er", err)
//         return response.badRequest("err");
//       } else {
//         console.log("data", data)
//         //res.send("Data updated!,", data);
//         res.send(data)
//         //return response.json(data);
//         // User.find({
//         //     _id: data._id
//         //   })
//         //   .populate("role")
//         //   .exec(function (error, role) {
//         //     console.log("Data updated!", role);
//         //     res.json(role)
//         //   })
//       }
//     });
// });

module.exports = router;