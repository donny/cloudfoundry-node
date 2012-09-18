var log4js = require('log4js');
var logger = log4js.getLogger();

var dataSchema = require('../models/data').schema;

exports = module.exports = function(server, redis, mongo) {

	server.post('/admin/:action', function(req, res, next) {
		if (req.params.action == 'redisSet') {
			return processRedisSet(redis, req, res, next);
		} else if (req.params.action == 'redisGet') {
			return processRedisGet(redis, req, res, next);
		} else if (req.params.action == 'mongoSet') {
			return processMongoSet(mongo, req, res, next);
		} else if (req.params.action == 'mongoGet') {
			return processMongoGet(mongo, req, res, next);
		} else {
			logger.warn('Action not found');
			res.send(404);
			return next();
		}
	});
};

function processRedisSet(redis, req, res, next) {
	var entity = req.body;
	if (entity) {
		redis.set(entity.name, JSON.stringify(entity), function(err, reply) {
			if (err) {
				logger.error('Redis Error ' + err);
				res.send(500);
				return next();
			} else {
				redis.expire(entity.name, 300); // Expire in 5 minutes.
				if (reply) {
					res.send(200, reply);
					return next();
				} else {
					res.send(200);
					return next();
				}
			}
		});
	} else {
		res.send(200);
		return next();
	}
}

function processRedisGet(redis, req, res, next) {
	var entity = req.body;
	if (entity) {
		redis.get(entity.name, function(err, reply) {
			if (err) {
				logger.error('Redis Error ' + err);
				res.send(500);
				return next();
			} else {
				if (reply) {
					res.send(200, reply);
					return next();
				} else {
					res.send(404);
					return next();
				}
			}
		});
	} else {
		res.send(404);
		return next();
	}
}

function processMongoSet(mongo, req, res, next) {
	var DataModel = mongo.model('Data', dataSchema);
	var entity = req.body;
	entity = JSON.parse(entity);
	if (entity) {
		var data = new DataModel(entity);
		data.save(function(err) {
			if (err) {
				logger.error('Mongo Error ' + err);
				res.send(500);
				return next();
			} else {
				res.send(200);
				return next();
			}
		});
	} else {
		res.send(200);
		return next();
	}
}

function processMongoGet(mongo, req, res, next) {
	var DataModel = mongo.model('Data', dataSchema);
	var entity = req.body;
	entity = JSON.parse(entity);
	if (entity) {
		DataModel.find({name: entity.name}, function(err, replies) {
			if (err) {
				logger.error('Mongo Error ' + err);
				res.send(500);
				return next();
			} else {
				if (replies) {
					res.send(200, replies);
					return next();
				} else {
					res.send(404);
					return next();
				}
			}			
		});
	} else {
		res.send(404);
		return next();
	}
}