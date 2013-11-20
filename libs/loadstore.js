
function LoadStore(){
  // An Array of objects with id and load k/v on them
  this.orderedArray = [];
  // An object with id -> index of value in orderedArray
  this.map = {};
}

LoadStore.prototype.setLoad = function(id, load){
  if(id in this.map){
    this.orderedArray[this.map[id]].load = load;
  }else{ 
    this.orderedArray.push({id: id, load: load});   
  }
  this.reSort();
};
LoadStore.prototype.removeId = function(id){
  if(id in this.map){
    this.orderedArray.splice(this.map[id], 1) ;
    delete this.map[id];
    console.log("finished removing id", id);
  }

  this.reSort();
};
LoadStore.prototype.getLoad = function(id){
  //No Id return the whole load store map with loads
  if(!id){
      return this.orderedArray;
  }

  if(id in this.map)
    return this.orderedArray[this.map[id]].load;
  else
    return null;
};
LoadStore.prototype.getLeastLoaded = function(id){
  if(this.orderedArray.length > 0)
    return this.orderedArray[0];
  else
    return null;
};

LoadStore.prototype.getMostLoaded = function(id){
  if(this.orderedArray.length > 0)
    return this.orderedArray[this.orderedArrray.length - 1];
  else
    return null;
};

LoadStore.prototype.reSort = function(){
  // sort the orderedArray
  this.orderedArray.sort(function(a, b){
    if (a.load == b.load)
      return 0;
    else if(a.load < b.load)
      return -1;
    else
      return 1;
  });
  // rebuild map
  this.map = {};
  this.orderedArray.forEach((function(ele, i){
    this.map[ele.id] = i;
  }).bind(this));
};
module.exports = LoadStore;
