'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Section = mongoose.model('Section'),
	_ = require('lodash');

/**
 * Create a Section
 */
exports.create = function(req, res) {
	var section = new Section(req.body);
	section.user = req.user;
	//var problem = false;
	//var myErrorMsg = 'didnt enter';
	//var allSection = Section.find();
	//allSection.forEach(function(oneSection){
	//	if(oneSection.course==section.course && oneSection.name==section.name){
	//		problem = true;
	//		return res.status(400).send({
	//			message: 'this section already exist'
	//		});
	//		//myErrorMsg = 'this section already exist';
	//		//console.log("entered----------------------");
	//	}
	//});



	//if(!problem){
		section.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.jsonp(section);
			}
		});
	//}
	//else
	//{
	//	return res.status(400).send({
	//		message: myErrorMsg
	//	});
	//}

};

/**
 * Show the current Section
 */
exports.read = function(req, res) {
	res.jsonp(req.section);
};

/**
 * Update a Section
 */
exports.update = function(req, res) {
	var section = req.section ;

	section = _.extend(section , req.body);

	section.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(section);
		}
	});
};

/**
 * Delete an Section
 */
exports.delete = function(req, res) {
	var section = req.section ;

	section.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(section);
		}
	});
};

/**
 * List of Sections
 */
exports.list = function(req, res) { 
	Section.find().sort('-created').populate('user', 'displayName').exec(function(err, sections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sections);
		}
	});
};

/**
 * Section middleware
 */
exports.sectionByID = function(req, res, next, id) { 
	Section.findById(id).populate('user', 'displayName').exec(function(err, section) {
		if (err) return next(err);
		if (! section) return next(new Error('Failed to load Section ' + id));
		req.section = section ;
		next();
	});
};

/**
 * Section authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.section.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
