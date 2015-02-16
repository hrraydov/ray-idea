'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Skill Schema
 */
var SkillSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'The skill name is required'
	},
	users: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		default: []
	},
	plus: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Position'
		}],
		default: []
	},
	required: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Position'
		}],
		default: []
	}
});

mongoose.model('Skill', SkillSchema);