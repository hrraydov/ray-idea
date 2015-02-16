'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller'),
	require('./users/users.show.server.controller'),
	require('./users/users.skills.server.controller'),
	require('./users/users.positions.server.controller')
);