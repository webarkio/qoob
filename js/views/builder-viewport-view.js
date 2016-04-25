/**
 * Create view for viewport in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderViewportView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    id: "builder-viewport",
    className: "pc",
    tpl: '',
    
    /**
     * View toolbar
     * @class BuilderViewportView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        var self = this;
        builder.storage.getBuilderTemplate('builder-viewport', function(err, data){
            self.tpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render viewport
     * @returns {Object}
     */
    render: function () { 
      this.$el.html(this.tpl({"postId": builder.storage.pageId}));
      return this;
    }
});


