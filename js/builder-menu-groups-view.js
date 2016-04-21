/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuGroupsView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    tagName: "ul",
    className: "catalog-list",
    buidler_menu_groupsTpl : null,
    
    /**
     * View menu groups
     * @class BuilderMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.buidler_menu_groupsTpl = _.template(builder.storage.getBuilderTemplate('buildermenu-groups'));
    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function (data) {
        
      var res = this.buidler_menu_groupsTpl(data);
      jQuery('#builder-menu .groups').prepend(res);

      return this;
    }
});