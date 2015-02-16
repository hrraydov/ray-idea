'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects/user/:username').get(projects.list);
	app.route('/projects').post(users.requiresLogin, projects.create);
	app.route('/projects/:urlName').get(projects.read);
	app.route('/projects/:projectId')
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	// Membership Routes
	app.route('/projects/:projectId/become-member').put(users.requiresLogin, projects.becomeMember);
	app.route('/projects/:projectId/cancel-candidature').put(users.requiresLogin, projects.cancelCandidature);
	app.route('/projects/:projectId/accept-candidature/:userId').put(users.requiresLogin, projects.hasAuthorization, projects.acceptCandidature);
	app.route('/projects/:projectId/decline-candidature/:userId').put(users.requiresLogin, projects.hasAuthorization, projects.declineCandidature);
	app.route('/projects/:projectId/remove-member/:userId').put(users.requiresLogin, projects.hasAuthorization, projects.removeMember);
	app.route('/projects/:projectId/send-invitation/:userId').put(users.requiresLogin, projects.hasAuthorization, projects.sendInvitation);
	app.route('/projects/:projectId/accept-invitation/:userId').put(users.requiresLogin, projects.acceptInvitation);
	app.route('/projects/:projectId/decline-invitation/:userId').put(users.requiresLogin, projects.declineInvitation);

	// Positions Routes
	app.route('/projects/:projectId/position').post(users.requiresLogin, projects.hasAuthorization, projects.createPosition);
	app.route('/projects/:projectId/position/:positionId')
		.put(users.requiresLogin, projects.hasAuthorization, projects.positionInProject, projects.updatePosition)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.positionInProject, projects.removePosition);
	app.route('/projects/:projectId/position/:positionId/add-required').put(users.requiresLogin, projects.hasAuthorization, projects.positionInProject, projects.addRequiredSkill);
	app.route('/projects/:projectId/position/:positionId/add-plus').put(users.requiresLogin, projects.hasAuthorization, projects.positionInProject, projects.addPlusSkill);
	app.route('/projects/:projectId/position/:positionId/remove-required').put(users.requiresLogin, projects.hasAuthorization, projects.positionInProject, projects.removeRequiredSkill);
	app.route('/projects/:projectId/position/:positionId/remove-plus').put(users.requiresLogin, projects.hasAuthorization, projects.positionInProject, projects.removePlusSkill);

	//Resources Routes
	app.route('/projects/:projectId/image').post(users.requiresLogin, projects.addImage);
	app.route('/projects/:projectId/image/:imageId').delete(users.requiresLogin, projects.removeImage);

	// Search Routes
	app.route('/position/:positionId/good-users').get(users.requiresLogin, projects.fullPosition, projects.goodUsers);

	// Finish by binding the Project middleware
	app.param('positionId', projects.positionById);
	app.param('projectId', projects.projectByID);
	app.param('urlName', projects.projectByUrlName);
	app.param('userId', projects.userById);
};
