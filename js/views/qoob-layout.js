/**
 * Create qoob view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobLayout = Backbone.View.extend(
    /** @lends QoobLayout.prototype */
    {
        tagName: 'div',
        id: 'qoob',
        /**
         * View qoob
         * @class QoobLayout
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.controller = options.controller;
            this.menu = new QoobMenuView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
            this.toolbar = new QoobToolbarView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
            this.editModeButton = new QoobEditModeButtonView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
            this.viewPort = new QoobViewportView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
        },
        /**
         * Render qoob view
         * @returns {Object}
         */
        render: function() {
            //FIXME: this.storage => this.model
            this.$el.html([this.toolbar.render().el, this.editModeButton.render().el, this.menu.render().el, this.viewPort.render().el]);
            this.editModeButton.hide();
            // this.$el.find('#builder').append(this.toolbar.render().el);
            // this.$el.find('#builder').append(this.editModeButton.render().el);
            
            // this.$el.find('#builder').append(this.menu.render().el);
            // this.$el.find('#builder-content').append(this.viewPort.render().el);

            return this;
        },
        resize: function() {
            this.toolbar.resize();
            this.editModeButton.resize();
            this.menu.resize();
            this.viewPort.resize();
        },
        setPreviewMode: function() {
            this.toolbar.setPreviewMode();
            this.editModeButton.setPreviewMode();
            this.menu.setPreviewMode();
            this.viewPort.setPreviewMode();
            this.resize();
        },
        setEditMode: function() {
            this.toolbar.setEditMode();
            this.editModeButton.setEditMode();
            this.menu.setEditMode();
            this.viewPort.setEditMode();
            this.resize();
        },
        setDeviceMode: function(mode) {
            this.toolbar.setDeviceMode(mode);
            this.viewPort.setDeviceMode(mode);
            //            this.resize();
        },
        startEditBlock: function(blockId){
            this.toolbar.startEditBlock(blockId);
            this.menu.startEditBlock(blockId);
            this.viewPort.startEditBlock(blockId);
        },
        stopEditBlock: function(){
            this.viewPort.stopEditBlock();
        }
    });
