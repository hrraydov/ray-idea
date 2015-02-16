'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	async = require('async'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	multiparty = require('multiparty'),
	cloudinary = require('cloudinary'),
	Project = mongoose.model('Project');

exports.addImage = function(req, res){
	var project = req.project;
	if(!project.user._id.equals(req.user._id) && project.members.indexOf(req.user._id) === -1){
		return  res.status(400).send({
			message: 'Error!!!'
		});
	}
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
			project.images.push({
				url: result.url,
				by: req.user._id
			});
			project.save(function(err, project){
				return res.json({project: project});
			});
		}, {angle: 'exif'});
    });
};

exports.removeImage = function(req, res){
	var project = req.project;
	var imageId = req.params.imageId;
	if(!project.user._id.equals(req.user._id) && project.members.indexOf(req.user._id) === -1){
		return  res.status(400).send({
			message: 'Error!!!'
		});
	}
	for(var i=0; i<project.images.length; i++){
		if(project.images[i]._id.equals(imageId) && (project.images[i].by._id.equals(req.user._id) || project.user._id.equals(req.user._id))){
			project.images.pull(project.images[i]);
			project.save(function(err, project){
				return res.json({});
			});
			break;
		}
	}
};