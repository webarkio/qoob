/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuGroupsView = Backbone.View.extend(
/** @lends QoobMenuGroupsView.prototype */{
    tagName: "ul",
    className: "catalog-list",
    id:"catalog-groups",
    events: {
        'change #lib-select': 'changeLib',
    },
    /**
     * View menu groups
     * @class QoobMenuGroupsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.storage = options.storage;
        this.groups = options.groups;
        this.controller = options.controller;
    },
    /**
     * Render menu groups
     * @returns {Object}
     */
    render: function () {
      var data = {
        "libs": this.storage.qoobData,
        "groups_arr" : _.sortBy(this.groups, 'position'),
        "curLib": this.storage.currentLib
      };

      this.$el.html(_.template(this.storage.qoobTemplates['menu-groups-preview'])(data));

      return this;
    },
    changeLib: function () {
        this.controller.changeLib(this.$el.find('#lib-select').val());
    }
});