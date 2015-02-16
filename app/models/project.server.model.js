'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var ProjectSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill project name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	type: {
		type: String,
		enum: ['public', 'private'],
		default: 'public'
	},
	description: {
		type: String,
		default: '',
		required: 'Plese fill in project description',
		trim: true
	},
	urlName: {
		type: String,
		index: true
	},
	positions: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Position'
		}],
		default: []
	},	
	members: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		default: []
	},
	candidates: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		default: []
	},
	images: {
		type: [{
			url: String,
			by: {
				type: Schema.Types.ObjectId,
				ref: 'User'
			}
		}],
		default: []
	}
});

ProjectSchema.methods.getPublicData = function(){
	if(this.type === 'private'){
		return {
			_id: this._id,
			user: this.user,
			name: this.name,
			description: this.description,
			type: this.type
		};
	}else{
		return {
			_id: this._id,
			user: this.user,
			name: this.name,
			description: this.description,
			type: this.type,
			members: this.members,
			positions: this.positions,
			images: this.images
		};
	}
};

mongoose.model('Project', ProjectSchema);