'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Teacher Schema
 */
var TeacherSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Teacher name',
        trim: true
    },
    designation: {
        type: String,
        default: '',
        required: 'Please fill Teacher designation',
        trim: true
    },
    tid: {
        type: String,
        default: '',
        unique: 'this id already exist',
        required: 'Please fill Teacher ID',
        trim: true
    },
    phone: {
        type: String,
        default: '',
        required: 'Please fill Teacher phone',
        trim: true
    },
    email: {
        type: String,
        default: '',
        unique: 'this email already exist',
        required: 'Please fill Teacher email',
        trim: true
    },
    department: {
        type: String,
        default: '',
        required: 'Please fill Teacher department',
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

mongoose.model('Teacher', TeacherSchema);
