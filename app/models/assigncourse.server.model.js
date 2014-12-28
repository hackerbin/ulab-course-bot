'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Assigncourse Schema
 */
var AssigncourseSchema = new Schema({
	teacher: {
		type: String,
		default: '',
		required: 'Please fill Assigncourse name',
		trim: true
	},
	course: {
		type: String,
		default: '',
		required: 'Please fill Assigncourse name',
		trim: true
	},
	section: {
		type: String,
		default: '',
		required: 'Please fill Assigncourse name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Assigncourse', AssigncourseSchema);
