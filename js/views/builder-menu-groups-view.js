/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuGroupsView = Backbone.View.extend(
/** @lends BuilderMenuGroupsView.prototype */{
    tagName: "ul",
    className: "catalog-list",
    id:"catalog-groups",
   
    /**
     * View menu groups
     * @class BuilderMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.storage=options.storage;
    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function () {
      var data = {
        "groups_arr" : _.sortBy(this.storage.builderData.groups, 'position')
      };

      this.$el.html(_.template(this.storage.builderTemplates['buildermenu-groups'])(data));

      return this;
    }
});