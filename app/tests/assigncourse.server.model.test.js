'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Assigncourse = mongoose.model('Assigncourse');

/**
 * Globals
 */
var user, assigncourse;

/**
 * Unit tests
 */
describe('Assigncourse Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			assigncourse = new Assigncourse({
				name: 'Assigncourse Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return assigncourse.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			assigncourse.name = '';

			return assigncourse.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Assigncourse.remove().exec();
		User.remove().exec();

		done();
	});
});