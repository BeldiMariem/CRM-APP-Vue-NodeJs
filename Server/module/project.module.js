const projectModel = require("../model/project.model");
const dotenv = require('dotenv');
const _ = require('lodash');

// Importing routes
dotenv.config();

module.exports.projectAdd = (project) => {
    return new Promise((resolve, reject)=>{
        projectModel.findOne({"title": project.title}).then(projectSearched => {
               if(projectSearched != undefined && projectSearched != null){
                   reject("This project already exist in the DataBase, please add another project!")
               }else{
                // Contact email does not exist, add it to db!
                let newProject = new projectModel(project);
                projectModel.collection.insertOne(newProject, function (err, docs) {
                  if (err){
                      reject(err);
                      return console.error(err);
                  } else {
                    resolve(docs.ops)
                    console.log("Project inserted to Collection",docs.ops);
                  }
                });
               }
        })
    });
}

module.exports.getProjects = () => {
    return new Promise((resolve, reject)=>{
        projectModel.find({}).then(projectSearched => {
               if(projectSearched != undefined && projectSearched != null){
                   resolve(projectSearched.reverse())
               }else{
                // No contact in found in db!
                reject("No project were found in db!")
               }
        })
    });
}