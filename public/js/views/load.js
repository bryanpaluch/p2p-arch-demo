define([
       'jquery',
       'underscore',
       'backbone',
       'bootstrap',
       'Templater',
], function($, _, Backbone){
  var LoadView = Backbone.View.extend({
    el: $('#dashboard'),
    events: {
    },
    initialize: function(){
      console.log("dash view initialized");
      var self= this;
    },
    onServerLoad : function(server){
      
      var serverid = server.id.replace(/\.|:/g, "x")
      var panel = $(".server_panel#" +  serverid);
      console.log(".server_panel#"+ serverid);

      console.log("panel:", panel);
      if(panel.length === 0){ 
        console.log("Creating panel");
        var panelcol = document.createElement("div");
        panelcol.id = serverid;
        panelcol.classList.add("server_panel");
        panelcol.classList.add("col-sm-4");
        $("#dashboard").append(panelcol);
        panel = $(".server_panel#"+ serverid);
        console.log("new panel:", panel);
        console.log("new panel[0]:", panel[0]);
      }
      console.log(Templates);
      var html = Templates['server_panel']({server: server}); 
      panel.html(html); 

    },
  });
  return LoadView;
});

