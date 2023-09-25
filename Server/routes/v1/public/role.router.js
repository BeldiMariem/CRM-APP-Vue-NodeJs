const router = require('express').Router();
// The return of the require contains the the register function assigned in authModule
const roleModule = require('../../../module/role.module');
const response = require('ybha-response');
const dotenv = require('dotenv');
const Role = require("../../../model/role.model");


router.post('/roleAdd', (req, res) => {
  console.log("aaaaaaaaaa", req.body)
  roleModule.roleAdd(req.body.department, req.body.roleFunctionalities).then(data =>
    response.json(res, data)
  ).catch(err => {
    response.badRequest(res, err);
    console.log("err", err)
  })
});

router.get('/getRoles', (req, res) => {
  Role.find({})
    .then(data => {
      console.log("The roles found after searching:", data);
      response.json(res, data)
    })
});


router.post('/updateRole/:idRole', (req, res) => {
  idRole = req.params.idRole;
  res.send(req.params.idRole);
  Role.findByIdAndUpdate(req.params.idRole, req.body, {
    useFindAndModify: false
  }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      //res.send("Data updated!");
      //response.json("Data updated!")
      //console.log("Data updated!",data);
    }
  });
  // ///console.log("aaaaa", id)
  //   roleModule.updateRole(req.params.id, req.body).then((data) => {
  //     console.log("req.params.id", req.params.id);
  //     console.log("req.body", req.body);
  //     console.log("yes role updated!", data);
  //     response.json(res, data);
  //   })
  //     .catch(err => {
  //       console.log("ERROR CATCH REJECT", err);
  //     });
});


router.get('/deleteRole/:idRole', (req, res) => {
  idRole = req.params.idRole;
  Role.findByIdAndDelete(idRole, function (err, docs) {
    if (err) {
      response.badRequest(res, err);
      console.log(err)
    } else {
      response.json(res, docs)
      console.log("Deleted : ", docs);
    }
  });
});

router.get('/getRoleByDepartment', (req, res) => {
  //console.log("req.query.roleName", req.query.roleName)
  let department = req.query.department;
  roleModule.getRoleByDepartment(department).then(data => {
    response.json(res, data)
  }).catch(err => {
    response.badRequest(res, err);
  })
});

module.exports = router;