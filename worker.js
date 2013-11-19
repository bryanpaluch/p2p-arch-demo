var LoadExchange = require("./libs/LoadExchange");
var argv = require("optimist").argv;

if(!argv.id) return;


var httpPort = argv.id + 3000;
var seedPort =argv.id + 9990;

var seeds = [ 
  {id: ":3001", transport: { host: 'localhost', port: 9991}},
  {id:":3002", transport: { host: 'localhost', port: 9992}},
  {id: ":3003", transport: { host: 'localhost', port: 9993}},
  {id: ":3004", transport: { host: 'localhost', port: 9994}},
  {id: ":3005", transport: { host: 'localhost', port: 9995}},
];

seeds.splice(argv.id - 1, 1);

console.log(seeds);

var le = new LoadExchange({ip: ":" + httpPort, port: seedPort, seeds: seeds});

le.startService(function(){
  console.log("Started load exchange service");
  setInterval(function(){
    console.log("Updating load");
    le.updateLoad(Math.floor(Math.random() * 100));
    console.log(le.getServers());
  }, 2000);
});
