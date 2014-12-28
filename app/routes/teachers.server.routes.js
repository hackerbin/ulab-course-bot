'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var teachers = require('../../app/controllers/teachers.server.controller');

	// Teachers Routes
	app.route('/teachers')
		.get(teachers.list)
		.post(users.requiresLogin, teachers.create);

	app.route('/teachers/:teacherId')
		.get(teachers.read)
		.put(users.requiresLogin, teachers.hasAuthorization, teachers.update)
		.delete(users.requiresLogin, teachers.hasAuthorization, teachers.delete);

	// Finish by binding the Teacher middleware
	app.param('teacherId', teachers.teacherByID);
};
