'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User');

exports.becomeMember = function(req, res){
	var user = req.user;
	var project = req.project;

	project.candidates.push(user._id);
	project.save(function(err, project){
		user.candidateFor.push(project._id);
		user.save(function(err, user){
			return res.json({});
		});
	});
};

exports.cancelCandidature = function(req, res){
	var user = req.user;
	var project = req.project;

	project.candidates.pull(user._id);
	project.save(function(err, project){
		user.candidateFor.pull(project._id);
		user.save(function(err, user){
			return res.json({});
		});
	});
};

exports.acceptCandidature = function(req, res){
	var project = req.project;
	var user = req.userToWork;

	project.members.push(user.id);
	project.candidates.pull(user.id);
	project.save(function(err, project){
		user.memberOf.push(project.id);
		user.candidateFor.pull(project.id);
		user.save(function(err, user){
			return res.json({});
		});
	});
};

exports.declineCandidature = function(req, res){
	var project = req.project;
	var user = req.userToWork;

	project.candidates.pull(user.id);
	project.save(function(err, project){
		user.candidateFor.pull(project.id);
		user.save(function(err, user){
			return res.json({});
		});
	});
};

exports.removeMember = function(req, res){
	var project = req.project;
	var user = req.userToWork;

	project.members.pull(user.id);
	project.save(function(err, project){
		user.memberOf.pull(project.id);
		user.save(function(err, user){
			return res.json({});
		});
	});
};

exports.sendInvitation = function(req, res){};

exports.acceptInvitation = function(req, res){};

exports.declineInvitation = function(req, res){};