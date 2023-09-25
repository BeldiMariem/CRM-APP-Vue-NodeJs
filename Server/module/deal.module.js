const dealModel = require("../model/deal.model");
const dotenv = require('dotenv');
const _ = require('lodash');

// Importing routes
dotenv.config();

module.exports.dealAdd = (deal) => {
    return new Promise((resolve, reject) => {
        let newDeal = new dealModel(deal);
        dealModel.collection.insertOne(newDeal, function (err, docs) {
            if (err) {
                reject(err);
                return console.error(err);
            } else {
                resolve(docs.ops)
                console.log("Deal inserted to Collection", docs.ops);
            }
        });
    });
}

module.exports.getDeals = () => {
    return new Promise((resolve, reject) => {
        dealModel.find({}).then(contactSearched => {
            if (contactSearched != undefined && contactSearched != null) {
                resolve(contactSearched)
            } else {
                // No contact in found in db!
                reject("No deal were found in db!")
            }
        })
    });
}

module.exports.getDealsByContactId = (contactId) => {
    //console.log(creatorId)
    return new Promise((resolve, reject) => {
        let deals = [];
        dealModel.find({}).then(deal => {
            deal.forEach(element => {
                if (element.contact == contactId) {
                    deals.push({
                        element
                    });
                }
            });
            if (deals != []) {
                console.log("deals", deals)
                resolve(deals)
            } else {
                console.log("error")
            }
        })
    });
}