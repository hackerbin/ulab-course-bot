'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var assigncourses = require('../../app/controllers/assigncourses.server.controller');

	// Assigncourses Routes
	app.route('/assigncourses')
		.get(assigncourses.list)
		.post(users.requiresLogin, assigncourses.create);

	app.route('/assigncourses/:assigncourseId')
		.get(assigncourses.read)
		.put(users.requiresLogin, assigncourses.hasAuthorization, assigncourses.update)
		.delete(users.requiresLogin, assigncourses.hasAuthorization, assigncourses.delete);

	// Finish by binding the Assigncourse middleware
	app.param('assigncourseId', assigncourses.assigncourseByID);
};
