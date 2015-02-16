'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User');

exports.show = function(req, res){
	var username = req.params.username;

	User.findOne({username: username}).populate('memberOf ownerOf', 'name urlName').exec(function(err, user){
		if(err){
			return res.status(400).send(err);
		}
		if(!user){
			return res.status(404).send({message: 'User not found'});
		}
		return res.json(user.getPublicData());
	});
};