/**
 * Create view for menu in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    id: "builder-menu",
    tpl: '',
    
    /**
     * View menu
     * @class BuilderMenuView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        var self = this;
        builder.storage.getBuilderTemplate('builder-menu', function(err, data){
            self.tpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render menu
     * @returns {Object}
     */
    render: function () { 
      this.$el.html(this.tpl());
      return this;
    }
});


