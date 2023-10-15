const router = require('express').Router();
const projectModule = require('../../../module/project.module');
const response = require('ybha-response');
const Project = require("../../../model/project.model");



router.post('/addProject', (req,res)=>{
    projectModule.projectAdd(req.body).then(projectData =>
      response.json(res,projectData)
      ).catch(err=> {console.log("err",err);
       response.badRequest(res, err);})
});

router.get('/getProjects', (req, res) => {
    projectModule.getProjects().then(data =>
  response.json(res,data)
  ).catch(err=> {console.log("err", err)
  response.badRequest(res, err);})
});

router.get('/deleteProject/:idProject', (req,res)=>{
  idPrpject = req.params.idProject;
  console.log("req.params.idProject", req.params.idProject)
  Project.findByIdAndDelete(idProject, function (err, docs) {
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


router.post('/updateProject/:idProject', (req,res)=>{
    idPrpject = req.params.idProject;
  console.log(idProject)
  Project.findByIdAndUpdate(req.params.idProject, req.body, {useFindAndModify: false}, function(err, data) {
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
module.exports = router;