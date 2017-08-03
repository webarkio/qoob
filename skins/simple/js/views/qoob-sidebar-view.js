/**
 * Create view for sidebar in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */

var QoobSidebarView = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    /** @lends QoobSidebarView.prototype */
    attributes: function() {
        return {
            id: "qoob-sidebar"
        };
    },
    /**
     * View sidebar
     * @class QoobSidebarView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
    },
    /**
     * Render sidebar
     * @returns {Object}
     */
    render: function() {
        return this;
    },
    setPreviewMode: function() {
        this.$el.addClass('hide-sidebar');
    },
    /**
     * Resize sidebar
     */
    resize: function() {
        this.$el.css('height', jQuery(window).height());
    }
});
