const router = require('express').Router();
const dealModule = require('../../../module/deal.module');
const response = require('ybha-response');
const Deal = require("../../../model/deal.model");



router.post('/addDeal', (req,res)=>{
    dealModule.dealAdd(req.body).then(dealData =>
      response.json(res,dealData)
      ).catch(err=> {response.badRequest(res, err);})
});

router.get('/getDeals', (req, res) => {
  dealModule.getDeals().then(data =>
  response.json(res,data)
  ).catch(err=> {console.log("err", err)
  response.badRequest(res, err);})
});

router.get('/deleteDeal/:idDeal', (req,res)=>{
  idDeal = req.params.idDeal;
  console.log("req.params.idContact", req.params.idDeal)
  Deal.findByIdAndDelete(idDeal, function (err, docs) {
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


router.post('/updateDeal/:idDeal', (req,res)=>{
  idDeal = req.params.idDeal;
  Deal.findByIdAndUpdate(req.params.idDeal, req.body, {useFindAndModify: false}, function(err, data) {
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

router.get('/getDealsByContact', (req, res) => {
let dealsContactId = req.query.dealsContactId;
 console.log("req.body.creatorId", dealsContactId)
  dealModule.getDealsByContactId(dealsContactId).then(data =>
  response.json(res,data)
  ).catch(err=> {console.log("err", err)
  response.badRequest(res, err);})
});
module.exports = router;