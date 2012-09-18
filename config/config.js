var cloudfoundry = require('cloudfoundry');
var util = require('util');
var redis = require('redis');
var mongoose = require('mongoose');
var log4js = require('log4js');
var logger = log4js.getLogger();
var config = require('../config.json');

exports = module.exports;

// Set the config information.

exports.port = (cloudfoundry.port || config.localport);
exports.host = (cloudfoundry.host || config.localhost);

exports.redisClient = function setRedisClient() {
	var rConfig = {};

	try {
		rConfig = cloudfoundry.redis['cf-node-redis'].credentials;
	} catch (err) {
		rConfig = {hostname: 'localhost', port: 6379, password: false};
	}

	// Connect to Redis.

	var rClient = redis.createClient(rConfig.port, rConfig.hostname);
	rClient.auth(rConfig.password);

	rClient.on('error', function(err) {
		logger.error('Redis Error ' + err);
	});

	return rClient;
}();

exports.mongoClient = function setMongoClient() {
	var mConfig = {};

	try {
		mConfig = cloudfoundry.mongodb['cf-node-mongodb'].credentials;
	} catch (err) {
		mConfig = {hostname: 'localhost', port: 27017, db: 'api-mongo', username: false, password: false};
	}

	// Connect to Mongo.

	// The connection will be the default connection bound to mongoose.connection.
	return mongoose.createConnection(mConfig.hostname, mConfig.db, mConfig.port, {user: mConfig.username, pass:mConfig.password}, function(err) {
		if (err) {
			logger.error('Mongo Error ' + err);
		}
	});
}();
