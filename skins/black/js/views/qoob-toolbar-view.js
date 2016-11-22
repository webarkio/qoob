/**
 * Create view for toolbar in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */

var QoobToolbarView = Backbone.View.extend({
    /** @lends QoobToolbarView.prototype */
    tagName: 'div',
    events: {
        'click .preview-mode-button': 'clickPreviewMode',
        'click .device-mode-button': 'clickDeviceMode',
        'click .exit-button': 'clickExit',
        'click .save-button': 'clickSave',
        'click .autosave-checkbox': 'clickAutosave',
        'change #lib-select': 'changeLib'
    },
    attributes: function() {
        return {
            id: "qoob-toolbar"
        };
    },
    /**
     * View toolbar
     * @class QoobToolbarView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
    },
    /**
     * Render toolbar
     * @returns {Object}
     */
    render: function() {
        var data = {
            "autosave": this.storage.__('autosave', 'Autosave'),
            "save": this.storage.__('save', 'Save'),
            "exit": this.storage.__('exit', 'Exit'),
            "libs": this.storage.librariesData,
            "curLib": this.storage.currentLib
        };
        this.$el.html(_.template(this.storage.getSkinTemplate('qoob-toolbar-preview'))(data));
        
        return this;
    },
    /**
     * Resize toolbar
     */
    resize: function() {
        this.$el.css({
            width: window.innerWidth
        });
        return this;
    },
    /**
     * Logo rotation
     * @param {Integer} side
     */
    logoRotation: function(side) {
        this.$el.find('.logo')
            .removeClass(function(index, css) {
                return (css.match(/\bside-\S+/g) || []).join(' ');
            })
            .addClass(side);
    },
    setPreviewMode: function() {
        this.$el.fadeOut(300);
    },
    setEditMode: function() {
        this.$el.fadeIn(300);
    },
    setDeviceMode: function(mode) {
        this.$el.find('.device-mode-button').removeClass('active');
        this.$el.find('.device-mode-button[name=' + mode + ']').addClass('active');
    },
    startEditBlock: function(blockId) {
        this.logoRotation('side-270');
    },
    /**
     * Show loader autosave
     */
    showSaveLoader: function() {
        this.$el.find('.save-button span.text').hide();
        this.$el.find('.save-button .clock').css('display', 'block');
    },
    /**
     * Hide loader autosave
     */
    hideSaveLoader: function() {
        this.$el.find('.save-button .clock').css('display', '');
        this.$el.find('.save-button span.text').show();
    },

    //EVENTS
    clickPreviewMode: function() {
        this.controller.setPreviewMode();
    },
    clickDeviceMode: function(evt) {
        this.controller.setDeviceMode(evt.target.name);
    },
    clickExit: function() {
        this.controller.exit();
    },
    clickSave: function() {
        this.controller.save();
    },
    clickAutosave: function(evt) {
        this.controller.setAutoSave(evt.target.checked);
    },
    changeLib: function () {
        this.controller.changeLib(this.$el.find('#lib-select').val());
    }
});
