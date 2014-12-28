'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Assigncourse = mongoose.model('Assigncourse'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, assigncourse;

/**
 * Assigncourse routes tests
 */
describe('Assigncourse CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Assigncourse
		user.save(function() {
			assigncourse = {
				name: 'Assigncourse Name'
			};

			done();
		});
	});

	it('should be able to save Assigncourse instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Assigncourse
				agent.post('/assigncourses')
					.send(assigncourse)
					.expect(200)
					.end(function(assigncourseSaveErr, assigncourseSaveRes) {
						// Handle Assigncourse save error
						if (assigncourseSaveErr) done(assigncourseSaveErr);

						// Get a list of Assigncourses
						agent.get('/assigncourses')
							.end(function(assigncoursesGetErr, assigncoursesGetRes) {
								// Handle Assigncourse save error
								if (assigncoursesGetErr) done(assigncoursesGetErr);

								// Get Assigncourses list
								var assigncourses = assigncoursesGetRes.body;

								// Set assertions
								(assigncourses[0].user._id).should.equal(userId);
								(assigncourses[0].name).should.match('Assigncourse Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Assigncourse instance if not logged in', function(done) {
		agent.post('/assigncourses')
			.send(assigncourse)
			.expect(401)
			.end(function(assigncourseSaveErr, assigncourseSaveRes) {
				// Call the assertion callback
				done(assigncourseSaveErr);
			});
	});

	it('should not be able to save Assigncourse instance if no name is provided', function(done) {
		// Invalidate name field
		assigncourse.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Assigncourse
				agent.post('/assigncourses')
					.send(assigncourse)
					.expect(400)
					.end(function(assigncourseSaveErr, assigncourseSaveRes) {
						// Set message assertion
						(assigncourseSaveRes.body.message).should.match('Please fill Assigncourse name');
						
						// Handle Assigncourse save error
						done(assigncourseSaveErr);
					});
			});
	});

	it('should be able to update Assigncourse instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Assigncourse
				agent.post('/assigncourses')
					.send(assigncourse)
					.expect(200)
					.end(function(assigncourseSaveErr, assigncourseSaveRes) {
						// Handle Assigncourse save error
						if (assigncourseSaveErr) done(assigncourseSaveErr);

						// Update Assigncourse name
						assigncourse.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Assigncourse
						agent.put('/assigncourses/' + assigncourseSaveRes.body._id)
							.send(assigncourse)
							.expect(200)
							.end(function(assigncourseUpdateErr, assigncourseUpdateRes) {
								// Handle Assigncourse update error
								if (assigncourseUpdateErr) done(assigncourseUpdateErr);

								// Set assertions
								(assigncourseUpdateRes.body._id).should.equal(assigncourseSaveRes.body._id);
								(assigncourseUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Assigncourses if not signed in', function(done) {
		// Create new Assigncourse model instance
		var assigncourseObj = new Assigncourse(assigncourse);

		// Save the Assigncourse
		assigncourseObj.save(function() {
			// Request Assigncourses
			request(app).get('/assigncourses')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Assigncourse if not signed in', function(done) {
		// Create new Assigncourse model instance
		var assigncourseObj = new Assigncourse(assigncourse);

		// Save the Assigncourse
		assigncourseObj.save(function() {
			request(app).get('/assigncourses/' + assigncourseObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', assigncourse.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Assigncourse instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Assigncourse
				agent.post('/assigncourses')
					.send(assigncourse)
					.expect(200)
					.end(function(assigncourseSaveErr, assigncourseSaveRes) {
						// Handle Assigncourse save error
						if (assigncourseSaveErr) done(assigncourseSaveErr);

						// Delete existing Assigncourse
						agent.delete('/assigncourses/' + assigncourseSaveRes.body._id)
							.send(assigncourse)
							.expect(200)
							.end(function(assigncourseDeleteErr, assigncourseDeleteRes) {
								// Handle Assigncourse error error
								if (assigncourseDeleteErr) done(assigncourseDeleteErr);

								// Set assertions
								(assigncourseDeleteRes.body._id).should.equal(assigncourseSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Assigncourse instance if not signed in', function(done) {
		// Set Assigncourse user 
		assigncourse.user = user;

		// Create new Assigncourse model instance
		var assigncourseObj = new Assigncourse(assigncourse);

		// Save the Assigncourse
		assigncourseObj.save(function() {
			// Try deleting Assigncourse
			request(app).delete('/assigncourses/' + assigncourseObj._id)
			.expect(401)
			.end(function(assigncourseDeleteErr, assigncourseDeleteRes) {
				// Set message assertion
				(assigncourseDeleteRes.body.message).should.match('User is not logged in');

				// Handle Assigncourse error error
				done(assigncourseDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Assigncourse.remove().exec();
		done();
	});
});