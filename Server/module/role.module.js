const Role = require("../model/role.model");
const dotenv = require('dotenv');


// Importing routes
dotenv.config();

// Function for registration new role : department and functionalities
module.exports.roleAdd = (department, roleFunctionalities) => {
    return new Promise((resolve, reject)=>{
        Role.findOne({"department": department}).then(data=>{
            console.log("l9itou wala mal9itoush ?",data);
            if(data != undefined && data != null){
                reject('This department already exists!');
            }else{
                let newRole = new Role({department, roleFunctionalities});
                console.log("new role instance ", newRole)
                // Inserting the data that will not be available in front end
                newRole.save((err, res) =>{
                    if(err){
                        reject(err);
                        console.log("****Role not saved + error****",err);
                    }else{
                        resolve(res);
                        console.log("****Success role saved!****",res);
                    }
                });

            }
        });
    });
}
// Function that allow to get a role by department entered
module.exports.getRoleByDepartment = (department) => {
    return new Promise((resolve, reject)=>{
        Role.findOne({"department": department}).then(dep=>{
            if(dep){
                resolve(dep)
            }else{
                reject("This department name does not exist in the database. Please enter a valid department name!")
            }
        })
    });
}


// module.exports.updateRole = (roleID, roleNewData) => {
//     return new Promise((resolve, reject)=>{
//         Role.findByIdAndUpdate(roleID, roleNewData);
//         //Role.save();
//         // Role.findOne({"roleName": roleID}, function (err, role) {
//         //     if (role == undefined && role == null) {
//         //         reject('No role found.');
//         //     }else{
//         //         console.log("@@@@@@@@@@@@ role found via find one and the email", role);
//         //         Role.findOneAndUpdate({_id: role._id}, roleNewData, {new: true, useFindAndModify: false}, (error,updateResult) =>{
//         //             if(updateResult){
//         //                 resolve('ROLE Updated Successfully!');
//         //                 console.log("USER UPDATES +RESULT ", updateResult);
//         //             }else{
//         //                 reject('There was a problem!')
//         //                 console.log("Something wrong when updating data!", error);
//         //             }
//         //         });

//         //     }
//         // });
//     });
// }