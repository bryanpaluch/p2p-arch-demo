var dns = require('dns');
var GossipMonger = require('gossipmonger');
var LoadStore = require('./loadstore');

function LoadExchange (options){
  this.ip = options.ip || new Error("LoadExchange needs an ip");
  this.dns = options.dns || false;
  this.seeds = options.seeds || [];
  this.port = options.port || 9742;
  this.loadStore = new LoadStore();
}

LoadExchange.prototype.updateLoad = function (load){
  this.gossipmonger.update(this.ip, load);
};

LoadExchange.prototype.getServers = function(cb){
  return (this.loadStore.getLoad());
};

LoadExchange.prototype.getMostLoaded = function(cb){
  return (this.loadStore.getMostLoaded());
};

LoadExchange.prototype.getLeastLoaded = function(cb){
  return (this.loadStore.getLeastLoaded());
};
LoadExchange.prototype.startService = function(cb){

  var createGossipMonger = (function(){
    this.gossipmonger = new GossipMonger(
      {
        id: this.ip,
        transport: {
          host: "localhost",
          port: this.port
        }
      },
      {
        seeds: this.seeds
      }
    );
    
    this.gossipmonger.on('error', function(err){
//      console.log("error with gossip monger", err);
    });
    this.gossipmonger.on('new peer', (this._onServerAdded).bind(this));
    this.gossipmonger.on('peer dead', (this._onServerRemoved).bind(this));
    this.gossipmonger.on('peer live', (this._onServerAdded).bind(this));
    this.gossipmonger.on('update', (this._onClusterUpdate).bind(this));
    
    this.gossipmonger.transport.listen((function(){
      this.gossipmonger.gossip();
      cb();
    }).bind(this));

  }).bind(this);

  if(this.dns){
    dns.resolve(this.dns, (function(err, addresses){
      if(addresses.length < 1)
        throw new Error ("bad dns address given");

      var addSeed = (function(seed){
        this.seeds.push({id: seed, transport: { host: seed, port: this.port}});
      }).bind(this);
      addresses.forEach(addSeed);
      createGossipMonger();
    }).bind(this));

  }else{
    createGossipMonger();
  }
};

LoadExchange.prototype._onServerAdded = function(peer){
  console.log("new server added", peer);
  this.loadStore.setLoad(peer.id, 0);
};

LoadExchange.prototype._onServerRemoved = function(peerId){
  console.log("server removed", peerId);
  this.loadStore.setLoad(peerId);
};

LoadExchange.prototype._onClusterUpdate = function(peerId, key, value){
  this.loadStore.setLoad(peerId, value);
};

module.exports = LoadExchange;
