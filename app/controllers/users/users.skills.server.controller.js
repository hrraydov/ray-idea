'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Skill = mongoose.model('Skill');

exports.getSkills = function(req, res){
	var username = req.params.username;

	User.findOne({username: username}, function(err, user){
		if(!user){
			return res.status(404).send({message: 'User not found'});
		}
		return res.json(user.skills);
	});
};

exports.addSkill = function(req, res){
	var user = req.user;
	var name = req.body.name;

	Skill.findOne({name: name.toLowerCase()}, function(err, skill){
		if(skill){
			//if skill already exists
			if(skill.users.indexOf(user._id) === -1){
				skill.users.push(user._id);
				skill.save(function(err, skill){
					if(err){
						return res.status(400).send({message: err});
					}
					var index;
					for(var i=0; i<user.skills.length; i++){
						if(name.toLowerCase() < user.skills[i].name.toLowerCase()){
							index = i;
							break;
						}
					}
					if(!!index || index === 0){
						user.skills.splice(index, 0,{
							name: name,
							skill: skill._id
						});
					}else{
						user.skills.push({
							name: name,
							skill: skill._id
						});
					}
					user.save(function(err, user){
						if(err) return res.status(400).send({message: err});
						return res.json(skill);
					});
				});
			}else{
				return res.status(400).send({message: 'That skill already exists'});
			}
		}else{
			//create the skill if it doesn't exist
			var newSkill = new Skill();
			newSkill.name = name.toLowerCase();
			newSkill.users.push(user._id);
			newSkill.save(function(err, skill){
				if(err){
					return res.status(400).send({message: err});
				}
				var index;
				for(var i=0; i<user.skills.length; i++){
					if(name.toLowerCase() < user.skills[i].name.toLowerCase()){
						index = i;
						break;
					}
				}
				if(!!index || index === 0){
					user.skills.splice(index, 0,{
						name: name,
						skill: skill._id
					});
				}else{
					user.skills.push({
						name: name,
						skill: skill._id
					});
				}
				user.save(function(err, user){
					if(err) return res.status(400).send({message: err});
					return res.json(skill);
				});
			});
		}
	});
};

exports.removeSkill = function(req, res){
	var user = req.user;
	var bodySkill = req.body;

	Skill.findById(bodySkill.skill, function(err, skill){
		skill.users.pull(user._id);
		skill.save(function(err, skill){
			if(err) return res.status(400).send({message: err});
			user.skills.pull(bodySkill);
			user.save(function(err, user){
				if(err) return res.status(400).send({message: err});
				return res.json();
			});
		});
	});
};