define([
       '/socket.io/socket.io.js',
       'jquery'
], function(io, $){
    var socket;
    var connect =  function(cb){
      $(document).ready(function (){
       socket = io.connect('/');
       if(cb) cb(socket);
      });
    };
  return {getConnection: function() { return socket ;}, connect: connect};
});

