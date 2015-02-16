'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	Project = mongoose.model('Project'),
	User = mongoose.model('User'),
	_ = require('lodash');

/**
 * Create a Project
 */
exports.create = function(req, res) {
	var user = req.user;
	var project = new Project(req.body);
	console.log(project.name.replace(/\s+/g, '-', '-').toLowerCase() + Date.now());
	project.urlName = project.name.replace(/\s+/g, '-', '-').toLowerCase() + '-' + Date.now();
	project.user = user._id;
	project.save(function(err, project) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			user.ownerOf.push(project);
			user.save(function(err){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				return res.jsonp(project);
			});
		}
	});
};

/**
 * Show the current Project
 */
exports.read = function(req, res){
	var user = req.user;
	var project = req.project;

	if(user){
		if(project.user.id === user.id){
			//user is owner
			//give full info
			return res.json({
				isOwner: true,
				isMember: true,
				project: project
			});
		}else if(project.members.indexOf(user.id) !== -1){
			//user is member
			return res.json({
				isOwner: false,
				isMember: true,
				project: project
			});
		}
	}
	return res.json({
		isMember: false,
		isOwner: false,
		project: project.getPublicData()
	});
};

/**
 * Update a Project
 */
exports.update = function(req, res) {
	var project = req.project;

	project = _.extend(project , req.body);
	console.log(project);

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(project);
		}
	});
};

/**
 * Delete an Project
 */
exports.delete = function(req, res) {
	var user = req.user;
	var project = req.project;

	project.remove(function(err){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}else{
			user.ownerOf.pull(project);
			user.save(function(err){
				if(err){
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}
				return res.json(project);
			});
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) { 
	var username = req.params.username;

	User.findOne({username: username}).populate('ownerOf memberOf candidateFor', '_id name urlName').exec(function(err, user){
		if(!user){
			return res.status(404).send({message: 'User not found'});
		}
		return res.json({
			memberOf: user.memberOf,
			ownerOf: user.ownerOf,
			candidateFor: user.candidateFor
		});
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {
	console.log('Project id: ' + id);
	Project.findById(id).populate('user candidates members images.by', '_id displayName username').populate('positions').exec(function(err, project) {
		if (err) return next(err);
		if (! project) return next(new Error('Failed to load Project ' + id));
		req.project = project ;
		next();
	});
};

exports.projectByUrlName = function(req, res, next, id) { 
	Project.findOne({urlName: id}).populate('user candidates members images.by', '_id displayName username').populate('positions').exec(function(err, project) {
		if (err) return next(err);
		if (! project) return next(new Error('Failed to load Project ' + id));
		req.project = project ;
		next();
	});
};

exports.userById = function(req, res, next, id) { 
	User.findById(id).select('-password').exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('User not found' + id));
		req.userToWork = user;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.project.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};