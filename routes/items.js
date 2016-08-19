var express = require('express');
var router = express.Router();
var q = require('q');
var Item = require('../models/item');

router
	.get('/', function(req, res){
		console.log(req.query.user);
		getItems(req.query.user).then(function(items){
			res.json(items);
		});
	})

	.post('/', function(req, res){
		var newItem = new Item(req.body);
		newItem.save(function(err, info){
			if (err) throw err;
			res.end();
		});
	})

	.put('/', function(req, res){
		var updateItem = Item.find({
			'addedBy': req.body.username,
			'itemname': req.body.itemname
		});
		
		updateItem = req.body;
		
		updateItem.save(function(err){
			if (err) throw err;
			else console.log('Item updated.');
		});
	})

	.delete('/', function(req, res){
		Item.findByIdAndRemove(req.query.id, function(err, item){
			if (err) throw err;
			else console.log("Item deleted");
		}).exec(res.end());
		
	});

function getItems(data){
	var deferred = q.defer();
	Item.find({
		//$or:[
		//	{
				'addedBy': data,
				//'receiver': data.receiver
		//	},
		//	{
				//'addedBy': data.receiver,
				//'receiver': data.username
		//	}
		//]
	}, function(err, item){
		if (err) deferred.reject(err);
		else deferred.resolve(item);
	});
	return deferred.promise;
}


module.exports = router;