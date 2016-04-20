/**
 * Create view block's preview
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuBlocksPreviewView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    tagName: "ul",
    className: "catalog-list",
    buidler_menu_blocks_previewTpl : null,
    
    /**
     * View menu groups
     * @class BuilderMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.buidler_menu_blocks_previewTpl = _.template(builder.storage.getBuilderTemplate('buildermenu-blocks-preview'));
    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function (data) {
      var res = this.buidler_menu_blocks_previewTpl(data);
      console.log(res);
      jQuery('#builder-menu .list-group').append(res);
      return this;
    }
});