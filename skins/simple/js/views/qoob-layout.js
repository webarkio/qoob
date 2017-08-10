/*global QoobSidebarView, QoobMenuView, QoobToolbarView, QoobEditModeButtonView, QoobViewportView, QoobImportExportView*/
/**
 * Create qoob view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobLayout = Backbone.View.extend( // eslint-disable-line no-unused-vars
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
            this.sidebar = new QoobSidebarView({
                "model": this.model,
                "storage": this.storage,
                "controller": this.controller
            });
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
            this.ImportExport = new QoobImportExportView({
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

            this.sidebar.$el.html([this.toolbar.render().el, this.menu.render().el]);

            this.$el.html([this.sidebar.render().el, this.viewPort.render().el, this.ImportExport.render().el, this.editModeButton.render().el]);
            // this.editModeButton.hide();
            return this;
        },
        resize: function() {
            this.sidebar.resize();
            this.viewPort.resize();
        },
        setPreviewMode: function() {
            this.editModeButton.setPreviewMode();
            this.sidebar.setPreviewMode();
            this.viewPort.setPreviewMode();
            this.resize();
        },
        setEditMode: function() {
            this.editModeButton.setEditMode();
            this.menu.setEditMode();
            this.viewPort.setEditMode();
            this.resize();
        },
        setDeviceMode: function(mode) {
            this.viewPort.setDeviceMode(mode);
        },
        startEditBlock: function(blockId) {
            this.menu.startEditBlock(blockId);
            this.viewPort.startEditBlock(blockId);
        },
        stopEditBlock: function() {
            this.viewPort.stopEditBlock();
        }
    });
