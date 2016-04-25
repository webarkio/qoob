/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuGroupsView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    tagName: "ul",
    className: "catalog-list",
    tpl : null,

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
        var self = this;
        builder.storage.getBuilderTemplate('buildermenu-groups', function(err, data){
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
        "groups_arr" : _.sortBy(builder.storage.builderData.groups, 'position') // FIXME getBuilderData
      }  
      this.$el.html(this.tpl(data));
      return this;
    }
});