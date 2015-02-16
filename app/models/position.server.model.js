'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Position Schema
 */
var PositionSchema = new Schema({
	name: String,
	project: {
		type: Schema.Types.ObjectId,
		ref: 'Project'
	},
	requiredSkills: {
		type: [{
			name: String,
			skill:{
				type: Schema.Types.ObjectId,
				ref: 'Skill'
			}	
		}],
		default: []
	},
	plusSkills: {
		type: [{
			name: String,
			skill:{
				type: Schema.Types.ObjectId,
				ref: 'Skill'
			}	
		}],
		default: []
	},
});

mongoose.model('Position', PositionSchema);