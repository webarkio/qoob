/*global QoobBlockWrapperView, QoobPageTemplatesView*/
/**
 * Create view for viewport in qoob layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobViewportView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobViewportView.prototype */
    {
        id: "qoob-viewport",
        deviceMode: "pc",
        previewMode: false,
        blocksCounter: 0,
        blockViews: [],
        /**
         * View menu
         * @class QoobViewportView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
            this.model.on("block_moveup", this.moveUpBlockView.bind(this));
            this.model.on("block_movedown", this.moveDownBlockView.bind(this));
        },
        /**
         * Render menu
         * @returns {Object}
         */
        render: function() {
            // Getting driver page id for iframe
            var url = this.storage.driver.getIframePageUrl();
            this.$el.html(_.template(this.storage.getSkinTemplate('qoob-viewport-preview'))({
                "url": url,
                "text_droppable_zone": this.storage.__('text_droppable_zone', 'Drop here to creative new block')
            }));
            this.$el.find('#qoob-iframe').on('libraries_loaded', this.iframeLoaded.bind(this));
            return this;
        },

        iframeLoaded: function() {
            this.trigger('iframe_loaded');
            this.triggerIframe();
            this.defaultDroppable();
        },
        /**
         * Create default droppable zone
         */
        defaultDroppable: function() {
            var self = this;
            this.$el.find('#droppable-default').droppable({
                tolerance: "pointer",
                drop: function(event, ui) {
                    //get block name
                    var name = ui.draggable.attr("id").replace("preview-block-", "");
                    // get lib
                    var lib = ui.draggable.data('lib');
                    // add new block
                    self.controller.addNewBlock(lib, name);
                }
            });
        },
        /**
         * Shows edit buttons, shadowing other blocks
         * @param {integer} blockId
         */
        startEditBlock: function(blockId) {
            var iframe = this.getWindowIframe();
            iframe.jQuery('.qoob-overlay').removeClass('active').addClass('no-active');
            iframe.jQuery('#outer-block-' + blockId).find('.qoob-overlay').removeClass('no-active').addClass('active');
        },
        stopEditBlock: function() {
            var iframe = this.getWindowIframe();
            iframe.jQuery('.qoob-overlay').removeClass('active').removeClass('no-active');
        },
        setPreviewMode: function() {
            this.previewMode = true;
            this.getIframeContents().find('#qoob-blocks').addClass('preview');
        },
        setEditMode: function() {
            this.previewMode = false;
            this.getIframeContents().find('#qoob-blocks').removeClass('preview');
        },
        setDeviceMode: function(mode) {
            var self = this;
            this.deviceMode = mode;
            var size = {
                'pc': {
                    'width': '100%'
                },
                'tablet-vertical': {
                    'width': '768px'
                },
                'phone-vertical': {
                    'width': '375px'
                },
                'tablet-horizontal': {
                    'width': '1024px'
                },
                'phone-horizontal': {
                    'width': '667px'
                }
            };
            this.getIframe().stop().animate(size[mode], 500, function() {
                var currentRoute = self.controller.current();
                if (currentRoute.route == 'startEditBlock') {
                    self.controller.scrollTo(currentRoute.params[0]);
                }
            });
        },
        /**
         * Resize qoob content
         */
        resize: function() {
            var size = {
                'height': (this.previewMode ? 0 : 70),
                'width': (this.previewMode ? 0 : 258)
            };

            this.$el.stop().animate({
                height: jQuery(window).height() - size.height,
                top: size.height,
                width: jQuery(window).width() - size.width,
                left: size.width
            });

            //Iframe resize
            this.getIframe().height(jQuery(window).height() - size.height);
            if (this.deviceMode == "pc") {
                this.getIframe().width("100%");
            }
        },
        scrollTo: function(blockId, position) {
            var scroll,
                iframe = this.getWindowIframe();

            if (position === 'top') {
                scroll = 0;
            } else if (position === 'bottom') {
                scroll = iframe.document.body.scrollHeight;
            } else {
                var el = this.getBlockView(blockId).$el;
                var windowHeight = this.getIframe().height();
                scroll = el.offset().top - (windowHeight - el.outerHeight(true)) / 2;
            }

            //Scroll to new block
            this.getWindowIframe().jQuery('html, body').animate({
                scrollTop: scroll
            }, 1000);
        },
        /**
         * Get BlockView by id
         * @param {Number} id modelId
         */
        getBlockView: function(id) {
            for (var i = 0; i < this.blockViews.length; i++) {
                if (this.blockViews[i].model.id == id) {
                    return this.blockViews[i];
                }
            }
        },
        /**
         * Remove BlockView by id
         * @param {Number} id modelId
         */
        delBlockView: function(model) {
            for (var i = 0; i < this.blockViews.length; i++) {
                if (this.blockViews[i].model.id == model.id) {
                    this.blockViews[i].dispose();
                    this.blockViews.splice(i, 1);
                }
            }

            // change block blank and more templates when add block
            if (this.blockViews.length == 0) {
                this.controller.changeDefaultPage('show');
            }
        },
        /**
         * Add block
         * 
         * @param {Object} block
         * @param {integer} afterBlockId
         */
        addBlock: function(model, beforeBlockId) {
            var self = this;
            var iframe = this.getWindowIframe();

            var blockWrapper = new QoobBlockWrapperView({
                model: model,
                storage: this.storage,
                controller: this.controller
            });

            //document fix 
            blockWrapper.setElement(self.controller.layout.viewPort.getWindowIframe().jQuery('<div id="outer-block-' + model.id + '">'));

            this.blockViews.push(blockWrapper);

            //If event 'blocks_loaded' have not been triggered
            this.blocksCounter++;
            blockWrapper.once('loaded', function() {
                self.trigger('block_loaded');
                self.blocksCounter--;
                if (self.blocksCounter === 0) {
                    self.trigger('blocks_loaded');
                }
            });

            //Attach element to DOM
            if (beforeBlockId > 0) {
                iframe.jQuery('#outer-block-' + beforeBlockId).before(blockWrapper.render().el);
            } else {
                iframe.jQuery('#qoob-blocks').append(blockWrapper.render().el);
            }

            // change block blank and more templates when add block
            if (this.blockViews.length > 0 && this.blockViews.length == 1) {
                this.controller.changeDefaultPage('hide');
            }

            // Remove empty div for mobile
            if (this.$el.find('#qoob-iframe').next('div').length > 0) {
                this.$el.find('#qoob-iframe').nextAll('div').remove();
            }

            this.triggerIframe();
        },
        /**
         * Create event change for iframe
         * @returns {Event} change
         */
        triggerIframe: function() {
            // Trigger change qoob blocks for theme
            var iframe = this.getWindowIframe();
            iframe.jQuery('#qoob-blocks').trigger('change');
            iframe.jQuery('a, .btn, input[type="submit"]').attr('onclick', 'return false;');
        },
        getIframe: function() {
            return this.$el.find('#qoob-iframe');
        },
        /**
         * Get iframe contents
         * @returns {DOMElement}
         */
        getIframeContents: function() {
            return this.getIframe().contents();
        },
        /**
         * Get iframe documnet
         * @returns {DOMElement}
         */
        getWindowIframe: function() {
            return window.frames["qoob-iframe"];
        },
        moveUpBlockView: function(modelId) {
            var currrentView = this.getBlockView(modelId);
            currrentView.$el.after(currrentView.$el.prev());
            this.scrollTo(modelId);
        },
        moveDownBlockView: function(modelId) {
            var currrentView = this.getBlockView(modelId);
            currrentView.$el.before(currrentView.$el.next());
            this.scrollTo(modelId);
        },
        /**
         * if pageData is empty
         */
        createBlankPage: function() {
            var iframe = this.getWindowIframe();
            var defaultTemplates = new QoobPageTemplatesView({
                storage: this.storage,
                controller: this.controller
            });
            iframe.jQuery('#qoob-blocks').append(defaultTemplates.render().el);
            this.storage.loadPageTemplates(function(error, data) {
                if (data && data.length > 0) {
                    defaultTemplates.render();
                }
            });
        },
        changeDefaultPage: function(event) {
            var qoobBlocks = this.getWindowIframe().jQuery('#qoob-blocks');

            if (event === 'hide') {
                // hide block blank and qoob templates when add block
                qoobBlocks.find('.qoob-templates').hide();
                this.$el.find('#droppable-default').hide();
            } else if (event === 'show') {
                // hide block blank and qoob templates when add block
                qoobBlocks.find('.qoob-templates').show();
                this.$el.find('#droppable-default').show();
            }
        }
    });
