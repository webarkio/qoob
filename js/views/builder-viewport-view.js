/**
 * Create view for viewport in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderViewportView = Backbone.View.extend(
    /** @lends BuilderMenuGroupsView.prototype */
    {
        id: "builder-viewport",
        deviceMode: "pc",
        previewMode: false,
        blocksCounter: 0,
        blockViews: [],
        /**
         * View menu
         * @class BuilderMenuView
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
            
            this.$el.html(_.template(this.storage.builderTemplates['builder-viewport-preview'])({ "url": url }));
            this.$el.find('#builder-iframe').on('load', this.iframeLoaded.bind(this));
            return this;
        },
        iframeLoaded: function() {
            this.trigger('iframe_loaded');
        },
        /**
         * Shows edit buttons, shadowing other blocks
         * @param {integer} blockId
         */
        startEditBlock: function(blockId) {
            var iframe = this.getWindowIframe();
            iframe.jQuery('.overlay').removeClass('active').addClass('no-active');
            iframe.jQuery('#outer-block-' + blockId).find('.overlay').removeClass('no-active').addClass('active');
        },
        stopEditBlock: function() {
            var iframe = this.getWindowIframe();
            iframe.jQuery('.overlay').removeClass('active').removeClass('no-active');
        },
        setPreviewMode: function() {
            this.previewMode = true;
            this.getIframeContents().find('#builder-blocks').addClass('preview');
        },
        setEditMode: function() {
            this.previewMode = false;
            this.getIframeContents().find('#builder-blocks').removeClass('preview');
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
         * Resize builder content
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
            this.getWindowIframe().jQuery('body').animate({
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
            this.blockViews = this.blockViews.filter(function(item) {
                if (item.model.id === id) {
                    item.dispose();
                }
            });
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
                iframe.jQuery('#builder-blocks').append(blockWrapper.render().el);
            }

            // setting block height
            //            builder.builderLayout.menu.resize();

            // Trigger change
            //            this.triggerBuilderBlock();
        },

        /**
         * Create event change for iframe
         * @returns {Event} change
         */
        triggerBuilderBlock: function() {
            // Trigger change builder blocks for theme
            var iframe = this.getWindowIframe();
            iframe.jQuery('#builder-blocks').trigger('change');
        },
        getIframe: function() {
            return this.$el.find('#builder-iframe');
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
            return window.frames["builder-iframe"];
        },
        moveUpBlockView: function (modelId) {
            var currrentView = this.getBlockView(modelId);
            currrentView.$el.after(currrentView.$el.prev());
        },
        moveDownBlockView: function (modelId) {
            var currrentView = this.getBlockView(modelId);
            currrentView.$el.before(currrentView.$el.next());
        }
    });
