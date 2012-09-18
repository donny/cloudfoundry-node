var restify = require('restify');

var config = require('./config/config');

var redisClient = config.redisClient;
var mongoClient = config.mongoClient;

// Get the request handlers.
var handlers = [];
handlers.push(require('./controllers/admin'));

// Create the RESTful server.
var server = restify.createServer();
server.use(restify.queryParser({mapParams: false}));
server.use(restify.bodyParser({mapParams: true}));

// Install the request handler.
for (var i = 0; i < handlers.length; i++) {
	handlers[i](server, redisClient, mongoClient);
}

// Run the server.
server.listen(config.port, function(){
	console.log("Listening at %s", server.url);
});
