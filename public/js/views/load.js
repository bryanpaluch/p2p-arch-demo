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
      
      var panel = $(".server_panel#"+ server.id);
      
      if(panel.length < 1){ 
        $("#dashboard").append("
        return this.createNewServerPanel(server);
     
      }
      var html = Templates.server_panel({server: serverLoad});

      panel.html(html); 

    },
  });
  return LoadView;
});

