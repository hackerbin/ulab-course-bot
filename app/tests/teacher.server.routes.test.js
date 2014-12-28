'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Teacher = mongoose.model('Teacher'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, teacher;

/**
 * Teacher routes tests
 */
describe('Teacher CRUD tests', function() {
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

		// Save a user to the test db and create new Teacher
		user.save(function() {
			teacher = {
				name: 'Teacher Name'
			};

			done();
		});
	});

	it('should be able to save Teacher instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Teacher
				agent.post('/teachers')
					.send(teacher)
					.expect(200)
					.end(function(teacherSaveErr, teacherSaveRes) {
						// Handle Teacher save error
						if (teacherSaveErr) done(teacherSaveErr);

						// Get a list of Teachers
						agent.get('/teachers')
							.end(function(teachersGetErr, teachersGetRes) {
								// Handle Teacher save error
								if (teachersGetErr) done(teachersGetErr);

								// Get Teachers list
								var teachers = teachersGetRes.body;

								// Set assertions
								(teachers[0].user._id).should.equal(userId);
								(teachers[0].name).should.match('Teacher Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Teacher instance if not logged in', function(done) {
		agent.post('/teachers')
			.send(teacher)
			.expect(401)
			.end(function(teacherSaveErr, teacherSaveRes) {
				// Call the assertion callback
				done(teacherSaveErr);
			});
	});

	it('should not be able to save Teacher instance if no name is provided', function(done) {
		// Invalidate name field
		teacher.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Teacher
				agent.post('/teachers')
					.send(teacher)
					.expect(400)
					.end(function(teacherSaveErr, teacherSaveRes) {
						// Set message assertion
						(teacherSaveRes.body.message).should.match('Please fill Teacher name');
						
						// Handle Teacher save error
						done(teacherSaveErr);
					});
			});
	});

	it('should be able to update Teacher instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Teacher
				agent.post('/teachers')
					.send(teacher)
					.expect(200)
					.end(function(teacherSaveErr, teacherSaveRes) {
						// Handle Teacher save error
						if (teacherSaveErr) done(teacherSaveErr);

						// Update Teacher name
						teacher.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Teacher
						agent.put('/teachers/' + teacherSaveRes.body._id)
							.send(teacher)
							.expect(200)
							.end(function(teacherUpdateErr, teacherUpdateRes) {
								// Handle Teacher update error
								if (teacherUpdateErr) done(teacherUpdateErr);

								// Set assertions
								(teacherUpdateRes.body._id).should.equal(teacherSaveRes.body._id);
								(teacherUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Teachers if not signed in', function(done) {
		// Create new Teacher model instance
		var teacherObj = new Teacher(teacher);

		// Save the Teacher
		teacherObj.save(function() {
			// Request Teachers
			request(app).get('/teachers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Teacher if not signed in', function(done) {
		// Create new Teacher model instance
		var teacherObj = new Teacher(teacher);

		// Save the Teacher
		teacherObj.save(function() {
			request(app).get('/teachers/' + teacherObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', teacher.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Teacher instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Teacher
				agent.post('/teachers')
					.send(teacher)
					.expect(200)
					.end(function(teacherSaveErr, teacherSaveRes) {
						// Handle Teacher save error
						if (teacherSaveErr) done(teacherSaveErr);

						// Delete existing Teacher
						agent.delete('/teachers/' + teacherSaveRes.body._id)
							.send(teacher)
							.expect(200)
							.end(function(teacherDeleteErr, teacherDeleteRes) {
								// Handle Teacher error error
								if (teacherDeleteErr) done(teacherDeleteErr);

								// Set assertions
								(teacherDeleteRes.body._id).should.equal(teacherSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Teacher instance if not signed in', function(done) {
		// Set Teacher user 
		teacher.user = user;

		// Create new Teacher model instance
		var teacherObj = new Teacher(teacher);

		// Save the Teacher
		teacherObj.save(function() {
			// Try deleting Teacher
			request(app).delete('/teachers/' + teacherObj._id)
			.expect(401)
			.end(function(teacherDeleteErr, teacherDeleteRes) {
				// Set message assertion
				(teacherDeleteRes.body.message).should.match('User is not logged in');

				// Handle Teacher error error
				done(teacherDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Teacher.remove().exec();
		done();
	});
});