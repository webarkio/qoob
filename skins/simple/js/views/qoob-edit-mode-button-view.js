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
        var self = this;
        this.controller.layout.sidebar.$el.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
            if (e.target == this) {
                self.$el.addClass('edit-mode-button-show');
                self.controller.layout.sidebar.$el.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
            }
        });
    },
    setEditMode: function() {
        this.$el.removeClass('edit-mode-button-show');
    },
    /**
     * If visible toolbar
     */
    isVisible: function() {
        return this.$el.is(":visible");
    }

});
