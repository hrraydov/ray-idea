'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	about: {
		type: String,
		trim: true,
		default: '',
	},
	gender: {
		type: String,
		trim: true,
		default: '',
		enum: ['', 'male', 'female']
	},	
    email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
    birthdate: {
		type: String,
		trim: true,
		default: '',
	},
	displayName: {
		type: String,
		trim: true
	},
	website: {
		type: String,
		trim: true,
		default: '',
		match: [/^(https?\:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please fill a valid website']
	},
	username: {
		type: String,
		unique: 'Username already exists',
		required: 'Please fill in a username',
		trim: true
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	education: {
		type: [{
			school: {
				type: String,
				required: 'The school name is required,'
			},
			from: {
				type: Number,
				required: 'The start year is required'
			},
			to: Number,
			speciality: String
		}],
		default: []
	},
	experience: {
		type: [{
			company: {
				type: String,
				required: 'The company name is required,'
			},
			from: {
				type: Number,
				required: 'The start year is required'
			},
			to: Number,
			position: String
		}],
		default: []
	},
	skills: {
		type: [{
			name: String,			
			skill: {
				type: Schema.Types.ObjectId,
				ref: 'Skill'
			}
		}],
		default: []
	},
	ownerOf: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Project'
		}],
		default: []
	},
	memberOf: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Project'
		}],
		default: []
	},
	candidateFor: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Project'
		}],
		default: []
	},
	avatar: {
		url: String
	}
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Create instatnce method for getting public information
 */
UserSchema.methods.getPublicData = function(){
	return {
		firstName: this.firstName,
		lastName: this.lastName,
		about: this.about,
		birthdate: this.birthdate,
		education: this.education,
		experience: this.experience,
		displayName: this.displayName,
		website: this.website,
		gender: this.gender,
		username: this.username,
		skills: this.skills,
		ownerOf: this.ownerOf,
		memberOf: this.memberOf,
		avatar: this.avatar
	};
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};

mongoose.model('User', UserSchema);