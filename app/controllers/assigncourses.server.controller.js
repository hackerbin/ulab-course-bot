'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Assigncourse = mongoose.model('Assigncourse'),
	_ = require('lodash');

/**
 * Create a Assigncourse
 */
exports.create = function(req, res) {
	var assigncourse = new Assigncourse(req.body);
	assigncourse.user = req.user;

	assigncourse.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(assigncourse);
		}
	});
};

/**
 * Show the current Assigncourse
 */
exports.read = function(req, res) {
	res.jsonp(req.assigncourse);
};

/**
 * Update a Assigncourse
 */
exports.update = function(req, res) {
	var assigncourse = req.assigncourse ;

	assigncourse = _.extend(assigncourse , req.body);

	assigncourse.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(assigncourse);
		}
	});
};

/**
 * Delete an Assigncourse
 */
exports.delete = function(req, res) {
	var assigncourse = req.assigncourse ;

	assigncourse.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(assigncourse);
		}
	});
};

/**
 * List of Assigncourses
 */
exports.list = function(req, res) { 
	Assigncourse.find().sort('-created').populate('user', 'displayName').exec(function(err, assigncourses) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(assigncourses);
		}
	});
};

/**
 * Assigncourse middleware
 */
exports.assigncourseByID = function(req, res, next, id) { 
	Assigncourse.findById(id).populate('user', 'displayName').exec(function(err, assigncourse) {
		if (err) return next(err);
		if (! assigncourse) return next(new Error('Failed to load Assigncourse ' + id));
		req.assigncourse = assigncourse ;
		next();
	});
};

/**
 * Assigncourse authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.assigncourse.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
