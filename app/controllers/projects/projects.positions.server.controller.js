'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	async = require('async'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	Position = mongoose.model('Position'),
	Skill = mongoose.model('Skill');

exports.createPosition = function(req, res){
	var project = req.project;
	var position = new Position(req.body);
	position.project = project._id;
	position.save(function(err, position){
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			project.positions.push(position);
			project.save(function(err){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				return res.jsonp(position);
			});
		}
	});
};

exports.updatePosition = function(req, res){
	var position = req.position;

	position = _.extend(position, req.body);

	position.save(function(err, position) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(position);
		}
	});
};

exports.removePosition = function(req, res){
	var project = req.project;
	var position = req.position;

	position.remove(function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			project.positions.pull(position);
			project.save(function(err){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				return res.json(position);
			});
		}
	});
};

exports.addRequiredSkill = function(req, res){
	var position = req.position;
	var name = req.body.name;

	Skill.findOne({name: name.toLowerCase()}, function(err, skill){
		if(skill){
			//if skill already exists
			if(skill.required.indexOf(position._id) === -1){
				skill.required.push(position._id);
				skill.save(function(err, skill){
					if(err){
						return res.status(400).send({message: err});
					}
					var index;
					for(var i=0; i<position.requiredSkills.length; i++){
						if(name.toLowerCase() < position.requiredSkills[i].name.toLowerCase()){
							index = i;
							break;
						}
					}
					if(!!index || index === 0){
						position.requiredSkills.splice(index, 0,{
							name: name,
							skill: skill._id
						});
					}else{
						position.requiredSkills.push({
							name: name,
							skill: skill._id
						});
					}
					position.save(function(err, position){
						if(err) return res.status(400).send({message: err});
						return res.json(position);
					});
				});
			}else{
				return res.status(400).send({message: 'That skill already exists'});
			}
		}else{
			//create the skill if it doesn't exist
			var newSkill = new Skill();
			newSkill.name = name.toLowerCase();
			newSkill.required.push(position._id);
			newSkill.save(function(err, skill){
				if(err){
					return res.status(400).send({message: err});
				}
				var index;
				for(var i=0; i<position.requiredSkills.length; i++){
					if(name.toLowerCase() < position.requiredSkills[i].name.toLowerCase()){
						index = i;
						break;
					}
				}
				if(!!index || index === 0){
					position.requiredSkills.splice(index, 0,{
						name: name,
						skill: skill._id
					});
				}else{
					position.requiredSkills.push({
						name: name,
						skill: skill._id
					});
				}
				position.save(function(err, position){
					if(err) return res.status(400).send({message: err});
					return res.json(position);
				});
			});
		}
	});
};

exports.addPlusSkill = function(req, res){
	var position = req.position;
	var name = req.body.name;

	Skill.findOne({name: name.toLowerCase()}, function(err, skill){
		if(skill){
			//if skill already exists
			if(skill.plus.indexOf(position._id) === -1){
				skill.plus.push(position._id);
				skill.save(function(err, skill){
					if(err){
						return res.status(400).send({message: err});
					}
					var index;
					for(var i=0; i<position.plusSkills.length; i++){
						if(name.toLowerCase() < position.plusSkills[i].name.toLowerCase()){
							index = i;
							break;
						}
					}
					if(!!index || index === 0){
						position.plusSkills.splice(index, 0,{
							name: name,
							skill: skill._id
						});
					}else{
						position.plusSkills.push({
							name: name,
							skill: skill._id
						});
					}
					position.save(function(err, position){
						if(err) return res.status(400).send({message: err});
						return res.json(position);
					});
				});
			}else{
				return res.status(400).send({message: 'That skill already exists'});
			}
		}else{
			//create the skill if it doesn't exist
			var newSkill = new Skill();
			newSkill.name = name.toLowerCase();
			newSkill.plus.push(position._id);
			newSkill.save(function(err, skill){
				if(err){
					return res.status(400).send({message: err});
				}
				var index;
				for(var i=0; i<position.plusSkills.length; i++){
					if(name.toLowerCase() < position.plusSkills[i].name.toLowerCase()){
						index = i;
						break;
					}
				}
				if(!!index || index === 0){
					position.plusSkills.splice(index, 0,{
						name: name,
						skill: skill._id
					});
				}else{
					position.plusSkills.push({
						name: name,
						skill: skill._id
					});
				}
				position.save(function(err, position){
					if(err) return res.status(400).send({message: err});
					return res.json(position);
				});
			});
		}
	});
};

exports.removeRequiredSkill = function(req, res){
	var position = req.position;
	var bodySkill = req.body;

	Skill.findById(bodySkill.skill, function(err, skill){
		skill.required.pull(position._id);
		skill.save(function(err, skill){
			if(err) return res.status(400).send({message: err});
			position.requiredSkills.pull(bodySkill);
			position.save(function(err, position){
				if(err) return res.status(400).send({message: err});
				return res.json(position);
			});
		});
	});
};

exports.removePlusSkill = function(req, res){
	var position = req.position;
	var bodySkill = req.body;

	Skill.findById(bodySkill.skill, function(err, skill){
		skill.plus.pull(position._id);
		skill.save(function(err, skill){
			if(err) return res.status(400).send({message: err});
			position.plusSkills.pull(bodySkill);
			position.save(function(err, position){
				if(err) return res.status(400).send({message: err});
				return res.json(position);
			});
		});
	});
};


function sortUsers(obj) {
    var arr = [];
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'id': prop,
                'k': obj[prop]
            });
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; });
    return arr; // returns array
}

exports.goodUsers = function(req, res){
	console.log('dsa');
	var position = req.position;
	var users = {};
	async.each(position.requiredSkills, function(skill, next){
		async.each(skill.skill.users, function(user, next){
			console.log('User: ' + user);
			if(!!users[user]){
				users[user] += 5;
			}else{
				users[user] = 5;
			}
			next();
		}, function(err){
			next();
		});
	}, function(err){
		async.each(position.plusSkills, function(skill, next){
			for(var user in skill.skill.users){
				if(!!users[user] && users[user] >= 10){
					users[user] += 1;
				}
			}
			next();
		}, function(err){
			console.log('Users');
			console.log(users);
			var sortedUsers = sortUsers(users);
			var result = [];
			async.each(sortedUsers, function(user, next){
				User.findById(user.id, function(err, user){
					result.push({
						username: user.username,
						displayName: user.displayName						
					});
					next();
				});
			}, function(err){
				return res.json(result);
			});
		});
	});
};

exports.fullPosition = function(req, res, next){
	console.log('asd');
	Position.findById(req.position._id).populate('requiredSkills.skill plusSkills.skill').exec(function(err, position){
		if (err) return next(err);
		if (!position) return next(new Error('Failed to load position'));
		req.position = position;
		next();
	});
};

exports.positionById = function(req, res, next , id){
	Position.findById(id).exec(function(err, position){
		if (err) return next(err);
		if (!position) return next(new Error('Failed to load position ' + id));
		req.position = position;
		next();
	});
};

exports.positionInProject = function(req, res, next){
	var position = req.position;
	var project = req.project;
	if(position.project.equals(project.id)){
		return next();
	}else{
		return res.status(400).send({
			message: 'Project does not have such a position'
		});
	}
};