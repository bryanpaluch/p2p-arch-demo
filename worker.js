var LoadExchange = require("./libs/LoadExchange");
var argv = require("optimist").argv;
var express = require('express');
var app = express();
var http = require('http');
var request = require('request');

if(!argv.id) return;


var httpPort = argv.id + 3000;
var seedPort =argv.id + 9990;

var seeds = [ 
  {id: "127.0.0.1:3001", transport: { host: 'localhost', port: 9991}},
  {id:"127.0.0.1:3002", transport: { host: 'localhost', port: 9992}},
  {id: "127.0.0.1:3003", transport: { host: 'localhost', port: 9993}},
  {id: "127.0.0.1:3004", transport: { host: 'localhost', port: 9994}},
  {id: "127.0.0.1:3005", transport: { host: 'localhost', port: 9995}},
];

seeds.splice(argv.id - 0, 1);

console.log(seeds);

// Start the Load Exchange and listen for update events

var le = new LoadExchange({ip: "127.0.0.1:" + httpPort, port: seedPort, seeds: seeds});

var load = 0;

// Sends a post to the display server when theres an update 
// Just for demo, this would be pointless in most cases


le.onUpdate(function(){
  var servers = le.getServers();
  request.post({url: "http://127.0.0.1:3000/serverLoad/" + "127.0.0.1:" + httpPort,
                json: servers, timeout: 400}, function(e, r){
                  if(e) 
                    console.log("ui server down...", e);

                });
});


le.startService(function(){
  console.log("Started load exchange service");
  setTimeout(function(){
    console.log("updating load for first time");
    le.updateLoad(load);
  }, 200);
});

// API Routes

var server = http.createServer(app);
app.configure(function(){
  app.set('port', httpPort );
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/least_loaded', function(req, res){
  res.json(le.getLeastLoaded());
});

app.post("/job", function(req, res){
  var job = req.body;
  load += job.load;
  le.updateLoad(load);
  setTimeout(function(){
    load -= job.load;
    le.updateLoad(load);
  }, job.time);
  res.send(200);
});
app.listen(httpPort);
