/**
 * Create view for toolbar in builder layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderEditModeButtonView = Backbone.View.extend({
    tagName:'button',
    className:'edit-mode-button',
    events: {
        'click': 'clickEditMode'
    },
    /**
     * View toolbar
     * @class BuilderToolbarView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
        // builder.on('set_preview_mode', this.onPreviewMode.bind(this));
        // builder.on('set_edit_mode', this.onEditMode.bind(this));
    },
    /**
     * Render toolbar
     * @returns {Object}
     */
    // render: function() {
    //     this.$el.html(_.template(this.storage.builderTemplates['builder-edit-mode-button'])());
    //     return this;
    // },
    clickEditMode: function() {
        this.controller.setEditMode();
    },
            setPreviewMode:function(){
                this.$el.fadeIn(300);  
            },
            setEditMode:function(){
                this.$el.fadeOut(300);  
            },

    /**
     * Resize toolbar
     */
    resize: function() {
        //edit-mode-button
        // this.$el.css({
        //     right: jQuery(window).width()-70+'px'
        // });
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
