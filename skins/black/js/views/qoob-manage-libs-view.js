/**
 * Manage libs view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobManageLibsView = Backbone.View.extend(
    /** @lends QoobManageLibsView.prototype */
    {
        events: {
            'click .create-template': 'clickCreateTemplate'
        },
        id: "manage-libs",
        attributes: function() {
            return {
                'class': "manage-libs settings",
                'data-side-id': "manage-libs"
            };
        },
        /**
         * View settings
         * @class QoobManageLibsView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            return this;
        }
    });