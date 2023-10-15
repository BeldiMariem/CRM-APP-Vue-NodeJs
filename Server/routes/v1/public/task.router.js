const router = require('express').Router();
const taskModule = require('../../../module/task.module');
const response = require('ybha-response');
const Task = require("../../../model/task.model");




router.post('/addTask', (req,res)=>{
    taskModule.taskAdd(req.body).then(atskData =>
      response.json(res,taskData)
      ).catch(err=> {response.badRequest(res, err);})
});

router.get('/getTasks', (req, res) => {
    taskModule.getTasks().then(data =>
  response.json(res,data)
  ).catch(err=> {console.log("err", err)
  response.badRequest(res, err);})
});

router.get('/deleteTask/:idTask', (req,res)=>{
  idTask = req.params.idTask;
  console.log("req.params.idContact", req.params.idTask)
  Project.findByIdAndDelete(idTask, function (err, docs) {
  if (err){
      response.badRequest(res, err);
      console.log(err)
  }
  else{
      response.json(res,docs)
      console.log("Deleted : ", docs);
  }
});
});


router.post('/updateTask/:idTask', (req,res)=>{
  idTask = req.params.idTask;
  Task.findByIdAndUpdate(req.params.idTask, req.body, {useFindAndModify: false}, function(err, data) {
     if(err){
       response.badRequest(res, err);
        console.log(err);
    }
    else{
        //res.send("Data updated!");
      response.json(res, data)
        console.log("Data updated!",data);
    }
  });
});

router.get('/getTasksByProject', (req, res) => {
let taskProjectId = req.query.taskProjectId;
 console.log("req.body.creatorId", taskProjectId)
  taskModule.getTasksByProjectId(taskProjectId).then(data =>
  response.json(res,data)
  ).catch(err=> {console.log("err", err)
  response.badRequest(res, err);})
});
module.exports = router;