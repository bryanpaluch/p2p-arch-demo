require.config({
  baseUrl: "/js/libs",
  paths: {
          'app' : "/js/app",
          'models': "/js/models",
          'views': "/js/views",
          'jquery': "/js/libs/jquery",
          'bootstrap' : "/js/libs/bootstrap",
        },
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },

    'bootstrap': { deps :['jquery'] },
  }
});
require([
  'app/connection',
  'views/load',
  'views/job',
],function(Connection, DashView, JobView){
    // Create a global to hold endpoint stuff that changes between deployments
    
    Connection.connect(function(io){
      console.log("Connected to socket.io");
      var job = new JobView();
      var dash = new DashView({events: io});
      io.on('serverLoad', function(server){
        console.log("Hit serverload", server);
        dash.onServerLoad(server);
      });
      console.log(dash);
    });
});


