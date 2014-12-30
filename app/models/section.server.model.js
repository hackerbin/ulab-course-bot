'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Section Schema
 */
var SectionSchema = new Schema({
	course: {
		type: String,
		default: '' ,
		required: 'Please select course',
		trim: true
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Section name',
		trim: true
	},
	day: {
		type: String,
		default: '',
		required: 'Please select day',
		trim: true
	},
	start: {
		type: String,
		default: '',
		required: 'Please set start time',
		trim: true
	},
	end: {
		type: String,
		default: '',
		required: 'Please set end time',
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



mongoose.model('Section', SectionSchema);
