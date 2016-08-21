var express = require('express');
var router = express.Router();
var q = require('q');
var Item = require('../models/item');

router
.get('/', function(req, res) {
        getItems(req.query.user).then(function(items) {
            res.json(items);
        });
    })

.post('/', function(req, res) {
    var newItem = new Item(req.body);
    newItem.save(function(err, info) {
        if (err) throw err;
        res.end();
    });
})

.put('/', function(req, res) {
    console.log(req.body);

    Item.findById(req.body._id, function(err, item) {
        console.log(item);
        item.update(req.body, function(err, info) {
            if (err) throw err;
            else console.log('Updated item');
            console.log(info);
            res.end();
        });
    });
})

.delete('/', function(req, res) {
    Item.findByIdAndRemove(req.query.id, function(err, item) {
        if (err) throw err;
        else console.log("Item deleted");
    }).exec(res.end());

});

function getItems(data) {
    var deferred = q.defer();
    Item.find({
        $or:[
          {
            'addedBy': data,
        	},
        	{
            'receiver': data
        	}
        ]
    }, function(err, item) {
        if (err) deferred.reject(err);
        else deferred.resolve(item);
    });
    return deferred.promise;
}


module.exports = router;
