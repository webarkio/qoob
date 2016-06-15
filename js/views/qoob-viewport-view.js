/**
 * Create view for viewport in qoob layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobViewportView = Backbone.View.extend(
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
            this.model.on("block_add", this.addBlock.bind(this));
            this.model.on("block_delete", this.delBlockView.bind(this));
            this.model.on("block_moveup", this.moveUpBlockView.bind(this));
            this.model.on("block_movedown", this.moveDownBlockView.bind(this));
        },
        /**
         * Render menu
         * @returns {Object}
         */
        render: function() {
            // Getting driver page id for iframe
            var url = this.storage.driver.getIframePageUrl(this.storage.pageId);
            
            this.$el.html(_.template(this.storage.qoobTemplates['qoob-viewport-preview'])({ "url": url }));
            this.$el.find('#qoob-iframe').on('load', this.iframeLoaded.bind(this));
            return this;
        },
        iframeLoaded: function() {
            this.trigger('iframe_loaded');
            this.getWindowIframe().onbeforeunload = function(){return false;};
        },
        /**
         * Shows edit buttons, shadowing other blocks
         * @param {integer} blockId
         */
        startEditBlock: function(blockId) {
            var iframe = this.getWindowIframe();
            iframe.jQuery('.overlay').removeClass('active').addClass('no-active');
            iframe.jQuery('#outer-block-' + blockId).find('.overlay').removeClass('no-active').addClass('active');
            iframe.jQuery('#outer-block-' + blockId).find('a').attr("onclick", "return false;");
        },
        stopEditBlock: function(blockId) {
            var iframe = this.getWindowIframe();
            iframe.jQuery('.overlay').removeClass('active').removeClass('no-active');
        },
        setPreviewMode: function() {
            this.previewMode = true;
            this.getIframeContents().find('#qoob-blocks').addClass('preview');
            this.getIframeContents().find('a').attr("onclick", "return false;");
        },
        setEditMode: function() {
            this.previewMode = false;
            this.getIframeContents().find('#qoob-blocks').removeClass('preview');
        },
        setDeviceMode: function(mode) {
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
            this.getIframe().stop().animate(size[mode]);
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
        scrollTo: function(blockId) {           
            //Scroll to new block
            this.getWindowIframe().jQuery('html, body').animate({
                scrollTop: this.getBlockView(blockId).$el.offset().top
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
            };
        },
        /**
         * Remove BlockView by id
         * @param {Number} id modelId
         */
        delBlockView: function(id) {
            for (var i = 0; i < this.blockViews.length; i++) {
                if (this.blockViews[i].model.id == id) {
                    this.blockViews[i].dispose();
                    this.blockViews.splice(i, 1);
                }
            };
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

            var blockWrapper = new BlockWrapperView({
                model: model,
                storage: this.storage,
                controller: this.controller
            });

            this.blockViews.push(blockWrapper);

            //If event 'blocks_loaded' have not been triggered
            if (this.blocksCounter !== null) {
                this.blocksCounter++;
                blockWrapper.once('loaded', function() {
                    self.blocksCounter--;
                    if (self.blocksCounter === 0) {
                        self.trigger('blocks_loaded');
                        self.blocksCounter = null;
                    }
                });
            }
            //Attach element to DOM
            if (beforeBlockId > 0) {
                iframe.jQuery('#outer-block-' + beforeBlockId).before(blockWrapper.render().el);
            } else {
                iframe.jQuery('#qoob-blocks').append(blockWrapper.render().el);
            }
            
            // hide block blank when add block
            if (iframe.jQuery('#qoob-blocks').find('.block-blank:visible').length > 0) {
                iframe.jQuery('#qoob-blocks').find('.block-blank').hide();
            }

            // Trigger change
            //            this.triggerQoobBlock();
        },

        /**
         * Create event change for iframe
         * @returns {Event} change
         */
        triggerQoobBlock: function() {
            // Trigger change qoob blocks for theme
            var iframe = this.getWindowIframe();
            iframe.jQuery('#qoob-blocks').trigger('change');
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
        moveUpBlockView: function (modelId) {
            var currrentView = this.getBlockView(modelId);
            currrentView.$el.after(currrentView.$el.prev());
            this.scrollTo(modelId);
        },
        moveDownBlockView: function (modelId) {
            var currrentView = this.getBlockView(modelId);
            currrentView.$el.before(currrentView.$el.next());
            this.scrollTo(modelId);
        },
        /**
         * First block if pageData is empty
         */
        createBlankBlock: function() {
            var iframe = this.getWindowIframe();
            iframe.jQuery('#qoob-blocks').append(_.template(this.storage.qoobTemplates['block-default-blank'])());
        }
    });
