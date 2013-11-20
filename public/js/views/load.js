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
    }, initialize: function(){
      var self= this;
    },
    onServerLoad : function(server){
      
      var serverid = server.id.replace(/\.|:/g, "x");
      var panel = $(".server_panel#" +  serverid);

      if(panel.length === 0){ 
        var panelcol = document.createElement("div");
        panelcol.id = serverid;
        panelcol.classList.add("server_panel");
        panelcol.classList.add("col-sm-4");
        $("#dashboard").append(panelcol);
        panel = $(".server_panel#"+ serverid);
      }
      var html = Templates.server_panel({server: server}); 
      panel.html(html); 

    },
    onJobHit : function(server){
      var serverid = server.replace(/\.|:/g, "x");
      var panel = $(".server_panel#" +  serverid);
      if(panel.length === 0) return;
      panel.fadeOut().fadeIn();

    },
  });
  return LoadView;
});

