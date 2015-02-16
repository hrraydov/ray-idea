'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	async = require('async'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	Position = mongoose.model('Position'),
	User = mongoose.model('User');

function sortPositions(obj){
	var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'id': prop,
                'k': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.k - a.k; });
    return arr; // returns array
}

exports.bestPositions = function(req, res){
	var user = req.profile;
	var positions = {};
	async.each(user.skills, function(skill, next){
		async.each(skill.skill.required, function(position, next){
			if(!!positions[position]){
				positions[position]+=5;
			}else{
				positions[position]=5;
			}
			next();
		}, function(err){
			async.each(skill.skill.plus, function(position, next){
				if(!!positions[position]){
					positions[position]+=1;
				}else{
					positions[position]=1;
				}
				next();
			}, function(err){
				next();
			});
		});
	}, function(err){
		var result = [];
		var sortedPositions = sortPositions(positions);
		console.log(sortedPositions);
		async.each(sortedPositions, function(position, next){
			Position.findById(position.id).populate('project', '_id name urlName').exec(function(err, position){
				result.push(position);
				next();
			});
		}, function(err){
			return res.json(result);
		});
	});
};