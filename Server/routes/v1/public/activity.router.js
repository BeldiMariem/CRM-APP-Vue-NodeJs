const router = require('express').Router();
const activityModule = require('../../../module/activity.module');
const response = require('ybha-response');
const verify = require("../../../middleware/verifyLoginToken");
const Activity = require("../../../model/activity.model");



router.post('/activityAdd', (req, res) => {
  activityModule.activityAdd(req.body).then(data =>
    response.json(res, data)
  ).catch(err => {
    response.badRequest(res, err);
  })
});

// router.get('/getActivities', (req, res) => {
//   let assignedUser = req.query.assignedUser;
//   console.log("assignedUser", assignedUser)
//   activityModule.getActivityByAssignedUser(assignedUser).then(data =>
//     response.json(res, data)
//   ).catch(err => {
//     console.log("err", err)
//     response.badRequest(res, err);
//   })
// });

router.get('/deleteActivity/:idActivity', (req, res) => {
  idActivity = req.params.idActivity;
  Activity.findByIdAndDelete(idActivity, function (err, docs) {
    if (err) {
      response.badRequest(res, err);
    } else {
      response.json(res, docs)
    }
  });
});


router.post('/updateActivity/:idActivity', (req, res) => {
  idActivity = req.params.idActivity;
  console.log("req.body", req.body)
  console.log("req.params.idActivity", req.params.idActivity)
  Activity.findByIdAndUpdate(req.params.idActivity, req.body, {
    useFindAndModify: false
  }, function (err, data) {
    if (err) {
      response.badRequest(res, err);
      console.log(err, "err");
    } else {
      //res.send("Data updated!");
      response.json(res, data)
      console.log("Data updated!", data);
    }
  });
});

router.get('/getActivities', (req, res) => {
  Activity.find({})
    .then(data => {
      console.log("The activities found after searching:", data);
      response.json(res, data)
    })
});
router.get('/getActivities/:idUser', (req, res) => {
  idUser = req.params.idUser;
  activityModule.getActivities(idUser).then(data => {
    response.json(res, data)
  }).catch(error => {
    response.badRequest(res.error)
  })
});
module.exports = router;