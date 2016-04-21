/**
 * Create view block's preview
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuBlocksPreviewView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    buidlerMenuBlocksPreviewTpl : null,
    
    /**
     * View menu groups
     * @class BuilderMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.buidlerMenuBlocksPreviewTpl = _.template(builder.storage.getBuilderTemplate('buildermenu-blocks-preview'));
        this.render();
    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function () {
      var data = {
        "groups" : builder.storage.builderData.groups,
        "items" : builder.storage.builderData.items
      };
      
     this.setElement(this.buidlerMenuBlocksPreviewTpl(data));

//      this.$el.html(this.buidlerMenuBlocksPreviewTpl(data));
      return this;
    }
});