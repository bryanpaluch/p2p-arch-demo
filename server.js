
/**
 * Module dependencies.
 */

var express = require('express'), 
  app = express(),
  http = require('http'), 
  rack = require('asset-rack');


var server = http.createServer(app);
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(new rack.JadeAsset({
    url: '/js/jadeTemplates.js',
    dirname: __dirname + '/views'})
  );
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(express.static('./public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});
// Default UI

var servers = {};

app.get('/', function(req, res){
  res.render('index', {servers: servers});
});

// Start up socket.io

io = require('socket.io').listen(server);
io.set('log level', 0);

io.sockets.on('connection', function(socket) {
	
		socket.on('disconnect', function() {
		
    });
});

// Get serverload and shove it down to all connected clients

app.post("/serverLoad/:id", function(req, res){
  console.log("serverload hit", req.body);
  servers.id = req.body;
  io.sockets.emit('serverLoad', req.body);
});


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

