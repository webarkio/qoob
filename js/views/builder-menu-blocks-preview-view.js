/**
 * Create view block's preview
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuBlocksPreviewView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    tagName: "div",
    className: "catalog-templates",
    tpl : null,
    
    /**
     * View menu groups
     * @class BuilderMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        var self = this;
        builder.storage.getBuilderTemplate('buildermenu-blocks-preview', function(err, data){
            self.tpl = _.template(data);
            self.render();
        });        

    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function () {
      var data = {
        "groups" : builder.storage.builderData.groups,
        "items" : builder.storage.builderData.items
      }
      this.$el.html(this.tpl(data));
      return this;
    }
});