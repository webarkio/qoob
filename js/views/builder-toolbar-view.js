/**
 * Create view for toolbar in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderToolbarView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    id: "builder-toolbar",
    tpl: '',
    
    /**
     * View toolbar
     * @class BuilderToolbarView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        var self = this;
        builder.storage.getBuilderTemplate('builder-toolbar', function(err, data){
            self.tpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render toolbar
     * @returns {Object}
     */
    render: function () { 
      this.$el.html(this.tpl());
      return this;
    }
});


