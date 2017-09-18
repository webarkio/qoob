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
    setEditMode: function() {
        var self = this;
        this.controller.layout.editModeButton.$el.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
            if (e.target == this) {
                self.$el.removeClass('hide-sidebar');
                self.controller.layout.resize();
                self.controller.layout.editModeButton.$el.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
            }
        });
    },
    /**
     * Resize sidebar
     */
    resize: function() {
        this.$el.css('height', jQuery(window).height());
    },
    /**
     * Show sidebar menu
     */
    showSwipeMenu: function() {
        jQuery('#qoob').removeClass('close-panel');
    },
    /**
     * Hide sidebar menu
     */
    hideSwipeMenu: function() {
        if (!jQuery('#qoob').hasClass('close-panel')) {
            jQuery('#qoob').addClass('close-panel');
        }
    }
});