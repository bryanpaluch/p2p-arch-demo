
/**
 * Module dependencies.
 */

var express = require('express'), 
    app = express(),
    http = require('http'), 
    rack = require('asset-rack'),
    Pool = require("poolee"),
    request = require('request');
    
var server = http.createServer(app); app.configure(function(){ app.set('port', 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(new rack.JadeAsset({
    url: '/js/jadeTemplates.js',
    dirname: __dirname + '/views/shared'})
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

// Eventually you would want to periodically ask one of the servers in the cluster for this
// for now config based
var config_servers = ["127.0.0.1:3001","127.0.0.1:3002","127.0.0.1:3003","127.0.0.1:3004","127.0.0.1:3005"];

var pool = new Pool(http, config_servers);

app.get('/', function(req, res){
  console.log("/ hit", servers);
  res.render('index', {servers: servers});
});

app.post("/job", function(req, res){

  console.log("Got job request", req.body);

  var post_job = function(service_uri, cb){
    console.log("posting job", service_uri);
    request.post({url: "http://" + service_uri + "/job", json: req.body, timeout: 200}, function(e, r, b){
      if(e) return cb(e);
      console.log("posted job to", service_uri);
      io.sockets.emit('jobHit', service_uri);
      res.send(200);
    });
  };

  var get_service_uri = function(cb){
    pool.get({path:"/least_loaded"}, function(e,r,b){
      if(e){
        console.log("error getting least loaded server... trying again");
        return cb(e, null);
      }
      b = JSON.parse(b);
      console.log("pooled request gave me", b, b.id);  
      cb(null, b.id);
    });
  };

  var tries = 0;
  var do_job = function(){
    tries++; 
    // Fail if we'ved tried this 3 times
    if(tries > 3){
      console.log("tries exceeded 3");
      return res.send(500);
    }

    console.log("getting service uri");
    get_service_uri(function(err, service_uri){
      console.log("service uri returned", err, service_uri);
      if(err) return do_job();
      post_job(service_uri, function(err){
        do_job();  
      });
    });
  };
  do_job();
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
  servers[req.params.id] = {id: req.params.id, view: req.body};
  io.sockets.emit('serverLoad', servers[req.params.id]);
  res.send(200);
});


server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

