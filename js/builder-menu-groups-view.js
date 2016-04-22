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
     * Set setting's id
     * @class BuilderMenuSettingsView
     * @augments Backbone.View
     * @constructs
     */
    attributes : function () {
        return {
            id : "catalog-groups"
        };
    },
    
    /**
     * View menu groups
     * @class BuilderMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.buidler_menu_groupsTpl = _.template(builder.storage.getBuilderTemplate('buildermenu-groups'));
        this.render();
    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function () {
      var data = {
        "groups_arr" : _.sortBy(builder.storage.builderData.groups, 'position') // FIXME getBuilderData
      }  
      this.$el.html(this.buidler_menu_groupsTpl(data));
      return this;
    }
});