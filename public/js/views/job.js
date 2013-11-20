define([
       'jquery',
       'underscore',
       'backbone',
       'bootstrap',
       'Templater',
], function($, _, Backbone){
  var JobView = Backbone.View.extend({
    el: $('#jobs'),
    events: {
      "click .create_job" : "createJob"
    },
    initialize: function(){
      console.log("job view initialized");
      var self= this;
    },
    createJob : function(){
      console.log("creating job");
      var time = Number($("input[type='text'][name='duration']").val()) || 1000;
      var load = Number($("input[type='text'][name='load']").val()) || 20

      var jobrequest = new XMLHttpRequest();
      jobrequest.open('POST', "/job", true);
      jobrequest.setRequestHeader("Content-Type", "application/json");
      jobrequest.onload = function(e){
        if (this.status == 200){
          console.log(this.responseText);
          console.log("Created job");
        }
      };
      console.log("Creating job with time:",time, "load:",load);
      jobrequest.send(JSON.stringify({time: time, load: load}));
    }
  });
  return JobView;
});

