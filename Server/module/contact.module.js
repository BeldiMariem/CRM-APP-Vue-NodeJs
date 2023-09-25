const contactModel = require("../model/contact.model");
const dotenv = require('dotenv');
const _ = require('lodash');

// Importing routes
dotenv.config();

module.exports.contactAdd = (contact) => {
    return new Promise((resolve, reject)=>{
        contactModel.findOne({"email": contact.email}).then(contactSearched => {
               if(contactSearched != undefined && contactSearched != null){
                   reject("This contact already exist in the DataBase, please add another contact!")
               }else{
                // Contact email does not exist, add it to db!
                let newContact = new contactModel(contact);
                contactModel.collection.insertOne(newContact, function (err, docs) {
                  if (err){
                      reject(err);
                      return console.error(err);
                  } else {
                    resolve(docs.ops)
                    console.log("Contact inserted to Collection",docs.ops);
                  }
                });
               }
        })
    });
}

module.exports.getContacts = () => {
    return new Promise((resolve, reject)=>{
        contactModel.find({}).then(contactSearched => {
               if(contactSearched != undefined && contactSearched != null){
                   resolve(contactSearched.reverse())
               }else{
                // No contact in found in db!
                reject("No contact were found in db!")
               }
        })
    });
}