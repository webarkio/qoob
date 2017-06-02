/**
 * Create view for toolbar in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobEditModeButtonView = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    tagName: 'button',
    className: 'edit-mode-button',
    events: {
        'click': 'clickEditMode'
    },
    /**
     * View QoobEditModeButton
     * @class QoobEditModeButtonView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
    },
    clickEditMode: function() {
        this.controller.setEditMode();
    },
    setPreviewMode: function() {
        this.$el.fadeIn(300);
    },
    setEditMode: function() {
        this.$el.fadeOut(300);
    },
    /**
     * Show toolbar
     */
    show: function() {
        this.$el.show();
    },
    /**
     * Hide toolbar
     */
    hide: function() {
        this.$el.hide();
    },
    /**
     * If visible toolbar
     */
    isVisible: function() {
        return this.$el.is(":visible");
    }

});
