'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	User = mongoose.model('User'),
	_ = require('lodash');



module.exports = _.extend(
	require('./projects/projects.crud.server.controller'),
	require('./projects/projects.membership.server.controller'),
	require('./projects/projects.positions.server.controller'),
	require('./projects/projects.resources.server.controller')
);