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
     * @class SettingsView
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
        var self = this;
        builder.storage.getBuilderTemplate('buildermenu-groups', function(err, data){
            self.buidler_menu_groupsTpl = _.template(data);
            self.render();
        });
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