'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	multiparty = require('multiparty'),
	cloudinary = require('cloudinary'),
	sanitizer = require('sanitizer');

/**
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	req.body.about = sanitizer.escape(req.body.about);

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;
		console.log(user);
		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

exports.uploadAvatar = function(req, res){
	var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
    	var file = files.file[0];
    	var contentType = file.headers['content-type'];
    	var extension = file.path.substring(file.path.lastIndexOf('.'));
    	if(!/jpg|jpeg|png/.test(extension)){
    		return res.status(400).send({
    			message: 'Only JPEG ang PNG files'
    		});
    	}
		cloudinary.uploader.upload(file.path, function(result){
			if(req.user.avatar){
				cloudinary.api.delete_resources([req.user._id],
    			function(result){}, { keep_original: true });
			}
			req.user.avatar.url = result.url;
			req.user.save(function(err, user){
				return res.json();
			});
		}, {public_id: req.user._id, angle: 'exif'});
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
