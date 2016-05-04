 var BuilderController = Backbone.Router.extend({

     routes: {
        "index":"index",
         "groups/:group": "showGroup", // #groups/name
     },
     index:function(){
        this.layout.menu.showIndex();
        this.layout.toolbar.logoRotation('side-0');
     },
     showGroup: function(group) {
         this.layout.menu.showGroup(group);
         this.layout.toolbar.logoRotation('side-90');
     },
     setLayout: function(layout) {
         this.layout = layout;
     },
     setPreviewMode: function() {
         this.layout.setPreviewMode();
     },
     setEditMode: function() {
         this.layout.setEditMode();
     },
     setDeviceMode: function(mode) {
         this.layout.setDeviceMode(mode);
     },
     setAutoSave: function(autosave) {

     },
     save: function() {
         console.log('SAVE');
     },
     exit: function() {
         console.log('EXIT');
     }

 });
