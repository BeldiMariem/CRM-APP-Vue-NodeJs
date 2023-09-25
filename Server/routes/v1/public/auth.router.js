const router = require('express').Router();
// The return of the require contains the the register function assigned in authModule
const authModule = require('../../../module/auth.module.js');
const response = require('ybha-response');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const bcrypt = require("bcrypt");
const moment = require("moment");
const User = require("../../../model/User.model");
const Role = require("../../../model/role.model");
const verify = require("../../../middleware/verifyLoginToken");
const verifyResetToken = require("../../../middleware/verifyResetToken");
const mailgun = require("mailgun-js");
const DOMAIN = 'sandbox8e56322c5aa44da880e4cab42e95356f.mailgun.org';
const mg = mailgun({
  apiKey: process.env.MAILGUN_APIKEY,
  domain: DOMAIN
});

router.post('/register', (req, res) => {
  // Case1 Secure : check token
  // Case2 Public APIs
  let addUser = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    birthDate: req.body.birthDate,
    password: req.body.password
  }
  let addLink = req.body.addLink;
  authModule.register(addUser, addLink).then(data =>
    response.json(res, data)
  ).catch(err => {
    response.badRequest(res, err);
  })
});

router.post('/login', (req, res) => {
  authModule.login(req.body.email, req.body.password).then(data => {
    User.find({
        _id: data.user._id
      })
      .populate("role")
      .exec(function (error, role) {
        res.json({
          "token": data.token,
          "user": role
        })

      })
  }).catch(err => {
    response.badRequest(res, err);
  })
  // authModule.login(user).then(data => {
  //   // generate Token
  //   // let payload = {
  //   //   email: req.body.email
  //   // };
  //   // var token = jwt.sign(payload, process.env.TOKEN_SECRET, {
  //   //   expiresIn: 86400
  //   // });
  //   // res.header('auth-token', token).send({
  //   //   token: token,
  //   //   user: data
  //   // });
  //   //response.json(res, {token: token, user: data});
  // }).catch(err => {
  //   console.log("err", err)
  //   console.log("err", res)
  //   response.badRequest(res, err);
  // })
});

router.put('/forgotPassword', (req, res) => {
  authModule.forgotPassword(req.body.email).then(data =>
    response.json(res, data)
  ).catch(err => {
    response.badRequest(res, err);
  })
});
router.put('/resetPasswordFirst', verify, (req, res) => {
  authModule.resetPasswordFirst(req.user.idUser, req.body.newPassword, req.body.confirmPassword).then(data => {
    response.json(res, data);
  }).catch(err => {
    response.badRequest(res, err);
  })
});

router.put('/resetPassword', verifyResetToken, (req, res) => {
  authModule.resetPassword(req.user.email, req.body.newPassword, req.body.confirmPassword).then(data => {
    response.json(res, data);
  }).catch(err => {
    response.badRequest(res, err);
  })
});

router.post('/updatePassword', verify, (req, res) => {
  console.log("req.user.idUser, req.body.currentPassword, req.body.newPassword", req.user.idUser, req.body.currentPassword, req.body.newPassword)
  authModule.updatePassword(req.user.idUser, req.body.currentPassword, req.body.newPassword).then(data => {
    response.json(res, data);
  }).catch(err => {
    response.badRequest(res, err);
  })
});

router.get('/user', verify, (req, res) => {
  User.findOne({
      "email": req.user.email
    })
    .then(u => {
      if (u != undefined && u != null) {
        response.json(res, u);
      }
    })
});
/**Update current user connected */
router.post('/updateProfile', verify, (req, res) => {
  let idUser = req.user.idUser;
  let userNewData = req.body;
  console.log("req.user", req.user)
  authModule.updateProfile(idUser, userNewData).then((data) => {
      // console.log("yes user updated!", data);
      // response.json(res, data);
      if (data) {
        User.find({
            _id: data._id
          })
          .populate("role")
          .exec(function (error, role) {
            res.json(role)
          })

      }
    })
    .catch(err => {
      console.log("ERROR CATCH REJECT", err);
      response.unauthorized(res, err);
    });
});

router.get('/getUsers', (req, res) => {
  User.find({})
    .populate("role")
    .exec(function (error, role) {
      res.json(role)
    })
});

router.get('/getInfoByToken', verify, (req, res) => {
  User.find({
      _id: req.user.idUser
    })
    .populate("role")
    .exec(function (error, role) {
      res.json(role)
    })
});

router.post('/addNewUser', (req, res) => {
  authModule.userAdd(req.body.email, req.body.role).then(data => {
    if (data) {
      User.find({
          _id: data._id
        })
        .populate("role")
        .exec(function (error, role) {
          res.json(role)
        })
    }
  }).catch(err => {
    response.badRequest(res, err);
  })
});

router.get('/verifyPassword/:password', verify, (req, res) => {
  password = req.params.password;
  console.log("req.params.password", req.params.password)
  authModule.verifyPassword(req.user.idUser, req.params.password).then(data => {
    response.json(res, data);
  }).catch(err => {
    response.badRequest(res, err)
  })
});
module.exports = router;