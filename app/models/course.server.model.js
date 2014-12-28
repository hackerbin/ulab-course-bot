'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
    title: {type: String, default: '', unique: 'this course title already exist', required: 'Please fill Course title', trim: true},
    code: {type: String, default: '', unique: 'this course code already exist', required: 'Please fill Course Code', trim: true},
    category: {type: String, default: '',  required: 'Please fill Category', trim: true},
    semester: {type: String, default: '',  required: 'Please fill Semester', trim: true},
    created: {type: Date, default: Date.now},
    user: {type: Schema.ObjectId, ref: 'User'}
});

mongoose.model('Course', CourseSchema);
