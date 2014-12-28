'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Section = mongoose.model('Section'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, section;

/**
 * Section routes tests
 */
describe('Section CRUD tests', function() {
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

		// Save a user to the test db and create new Section
		user.save(function() {
			section = {
				name: 'Section Name'
			};

			done();
		});
	});

	it('should be able to save Section instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Section
				agent.post('/sections')
					.send(section)
					.expect(200)
					.end(function(sectionSaveErr, sectionSaveRes) {
						// Handle Section save error
						if (sectionSaveErr) done(sectionSaveErr);

						// Get a list of Sections
						agent.get('/sections')
							.end(function(sectionsGetErr, sectionsGetRes) {
								// Handle Section save error
								if (sectionsGetErr) done(sectionsGetErr);

								// Get Sections list
								var sections = sectionsGetRes.body;

								// Set assertions
								(sections[0].user._id).should.equal(userId);
								(sections[0].name).should.match('Section Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Section instance if not logged in', function(done) {
		agent.post('/sections')
			.send(section)
			.expect(401)
			.end(function(sectionSaveErr, sectionSaveRes) {
				// Call the assertion callback
				done(sectionSaveErr);
			});
	});

	it('should not be able to save Section instance if no name is provided', function(done) {
		// Invalidate name field
		section.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Section
				agent.post('/sections')
					.send(section)
					.expect(400)
					.end(function(sectionSaveErr, sectionSaveRes) {
						// Set message assertion
						(sectionSaveRes.body.message).should.match('Please fill Section name');
						
						// Handle Section save error
						done(sectionSaveErr);
					});
			});
	});

	it('should be able to update Section instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Section
				agent.post('/sections')
					.send(section)
					.expect(200)
					.end(function(sectionSaveErr, sectionSaveRes) {
						// Handle Section save error
						if (sectionSaveErr) done(sectionSaveErr);

						// Update Section name
						section.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Section
						agent.put('/sections/' + sectionSaveRes.body._id)
							.send(section)
							.expect(200)
							.end(function(sectionUpdateErr, sectionUpdateRes) {
								// Handle Section update error
								if (sectionUpdateErr) done(sectionUpdateErr);

								// Set assertions
								(sectionUpdateRes.body._id).should.equal(sectionSaveRes.body._id);
								(sectionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sections if not signed in', function(done) {
		// Create new Section model instance
		var sectionObj = new Section(section);

		// Save the Section
		sectionObj.save(function() {
			// Request Sections
			request(app).get('/sections')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Section if not signed in', function(done) {
		// Create new Section model instance
		var sectionObj = new Section(section);

		// Save the Section
		sectionObj.save(function() {
			request(app).get('/sections/' + sectionObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', section.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Section instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Section
				agent.post('/sections')
					.send(section)
					.expect(200)
					.end(function(sectionSaveErr, sectionSaveRes) {
						// Handle Section save error
						if (sectionSaveErr) done(sectionSaveErr);

						// Delete existing Section
						agent.delete('/sections/' + sectionSaveRes.body._id)
							.send(section)
							.expect(200)
							.end(function(sectionDeleteErr, sectionDeleteRes) {
								// Handle Section error error
								if (sectionDeleteErr) done(sectionDeleteErr);

								// Set assertions
								(sectionDeleteRes.body._id).should.equal(sectionSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Section instance if not signed in', function(done) {
		// Set Section user 
		section.user = user;

		// Create new Section model instance
		var sectionObj = new Section(section);

		// Save the Section
		sectionObj.save(function() {
			// Try deleting Section
			request(app).delete('/sections/' + sectionObj._id)
			.expect(401)
			.end(function(sectionDeleteErr, sectionDeleteRes) {
				// Set message assertion
				(sectionDeleteRes.body.message).should.match('User is not logged in');

				// Handle Section error error
				done(sectionDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Section.remove().exec();
		done();
	});
});