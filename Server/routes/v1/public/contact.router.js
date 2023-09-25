const router = require('express').Router();
const contactModule = require('../../../module/contact.module');
const response = require('ybha-response');
const Contact = require("../../../model/contact.model");



router.post('/addContact', (req,res)=>{
    contactModule.contactAdd(req.body).then(contactData =>
      response.json(res,contactData)
      ).catch(err=> {console.log("err",err);
       response.badRequest(res, err);})
});

router.get('/getContacts', (req, res) => {
  contactModule.getContacts().then(data =>
  response.json(res,data)
  ).catch(err=> {console.log("err", err)
  response.badRequest(res, err);})
});

router.get('/deleteContact/:idContact', (req,res)=>{
  idContact = req.params.idContact;
  console.log("req.params.idContact", req.params.idContact)
  Contact.findByIdAndDelete(idContact, function (err, docs) {
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


router.post('/updateContact/:idContact', (req,res)=>{
  idContact = req.params.idContact;
  console.log(idContact)
  Contact.findByIdAndUpdate(req.params.idContact, req.body, {useFindAndModify: false}, function(err, data) {
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