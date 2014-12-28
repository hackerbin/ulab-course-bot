'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Teacher = mongoose.model('Teacher'),
	_ = require('lodash');
var nodemailer = require("nodemailer");
/**
 * Create a Teacher
 */

var mailOptions = {
	from: 'Robin<sharmin.sultana.dola@gmail.com>', // sender address
	to: 'robin@dexsa.org', // list of receivers
	subject: 'test mail from robin', // Subject line
	text: 'Hello from robin', // plaintext body
	html: '<b>Hello Tanvir ✔</b>' // html body
};

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'sharmin.sultana.dola@gmail.com',
		pass: 'qwerty098'
	}
});

exports.create = function(req, res) {
	var teacher = new Teacher(req.body);
	teacher.user = req.user;

	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log(error);
		}else{
			console.log('Message sent: ' + info.response);
		}
	});

	teacher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teacher);
		}
	});


};

/**
 * Show the current Teacher
 */
exports.read = function(req, res) {
	res.jsonp(req.teacher);
};







//var smtpTransport = nodemailer.createTransport("SMTP",{
//	service: "Gmail",
//	auth: {
//		user: "techdecipher@gmail.com",
//		pass: "qwerty!23"
//	}
//});
/**
 * Update a Teacher
 */
exports.update = function(req, res) {
	var teacher = req.teacher ;

	teacher = _.extend(teacher , req.body);

	teacher.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teacher);
		}
	});
};

/**
 * Delete an Teacher
 */
exports.delete = function(req, res) {
	var teacher = req.teacher ;

	teacher.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teacher);
		}
	});
};

/**
 * List of Teachers
 */
exports.list = function(req, res) { 
	Teacher.find().sort('-created').populate('user', 'displayName').exec(function(err, teachers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(teachers);
		}
	});
};

/**
 * Teacher middleware
 */
exports.teacherByID = function(req, res, next, id) { 
	Teacher.findById(id).populate('user', 'displayName').exec(function(err, teacher) {
		if (err) return next(err);
		if (! teacher) return next(new Error('Failed to load Teacher ' + id));
		req.teacher = teacher ;
		next();
	});
};


exports.testMethod = function(req,res) {
	var teacher = req.teacher ;
	sendmail();
	res.jsonp(req.teacher);

};

/**
 * Teacher authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.teacher.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
