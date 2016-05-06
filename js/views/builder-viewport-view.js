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
                    iframeLoaded: false,
                    iframeLoadedFunctions: [],
                    blocksCounter: 0,
                    /**
                     * View menu
                     * @class BuilderMenuView
                     * @augments Backbone.View
                     * @constructs
                     */
                    initialize: function (options) {
                        this.controller = options.controller;
                        this.storage = options.storage;
                        this.model.on("block_add", this.addBlock.bind(this));
                        // builder.on('start_edit_block', this.onEditStart.bind(this));
                        // builder.on('stop_edit_block', this.onEditStop.bind(this));
                    },
                    getDefaultTemplateAdapter: function () {
                        return 'hbs';
                    },
                    /**
                     * Render menu
                     * @returns {Object}
                     */
                    render: function () {
                        this.$el.html(_.template(this.storage.builderTemplates['builder-viewport'])({"postId": this.storage.pageId}));
                        return this;
                    },
                    /**
                     * Shows edit buttons, shadowing other blocks
                     * @param {integer} blockId
                     */
                    startEditBlock: function (blockId) {
                        var iframe = this.getWindowIframe();
                        iframe.jQuery('.overlay').removeClass('active').addClass('no-active');
                        iframe.jQuery('#outer-block-' + blockId).find('.overlay').removeClass('no-active').addClass('active');
                    },
                    stopEditBlock: function () {
                        var iframe = this.getWindowIframe();
                        iframe.jQuery('.overlay').removeClass('active').removeClass('no-active');

                    },
                    /**
                     * @callback createBlockCallback
                     * @param {Object} view block.
                     */

                    /**
                     * Create view block
                     * 
                     * @param {Object} model
                     * @param {String} template html block
                     * @param {createBlockCallback} cb - A callback to run.
                     */
                    createBlock: function (model, template, cb) {
                        var block = new BlockView({
                            model: model
                        });

                        var templateId = model.attributes.template;

                        builder.storage.getConfig(templateId, function (err, config) {
                            var tplAdapter = config.blockTemplateAdapter || builder.options.blockTemplateAdapter;
                            block.template = BuilderExtensions.templating[tplAdapter](template);
                            cb(null, block);
                        });
                    },
                    onLoad: function (func) {
                        if (this.iframeLoaded) {
                            func();
                        } else {
                            this.iframeLoadedFunctions.push(func);
                        }
                    },
                    triggerLoad: function () {
                        this.iframeLoaded = true;
                        while (this.iframeLoadedFunctions.length > 0) {
                            this.iframeLoadedFunctions.shift()();
                        }
                    },
                    /**
                     * Devices settings
                     * @returns object field devices
                     */
                    devicesSettings: function () {
                        return {
                            "name": "devices",
                            "label": "Visible Devices",
                            "type": "devices",
                            "settings": [{
                                    "name": "desktop",
                                    "label": "Desktop"
                                }, {
                                    "name": "tablet",
                                    "label": "Tablet"
                                }, {
                                    "name": "mobile",
                                    "label": "Mobile"
                                }],
                            "default": ""
                        }
                    },
                    /**
                     * @callback createSettingsCallback
                     * @param {Object} DOMElement
                     */

                    /**
                     * Create settings view
                     * 
                     * @param {Object} model
                     * @param {createSettingsCallback} cb - A callback to run.
                     */
                    createSettings: function (model, cb) {
                        var self = this;
                        builder.storage.getConfig(model.get('template'), function (err, config) {
                            var settings = config.settings;
                            // Add devices field
                            if (!_.findWhere(settings, {label: "Visible Devices"})) {
                                settings.push(self.devicesSettings());
                            }

                            var settingsView = new BuilderMenuSettingsView({"model": model, "config": settings});

                            cb(null, settingsView);
                        });
                    },
                    /**
                     * Add block
                     * 
                     * @param {Object} block
                     * @param {integer} afterBlockId
                     */
                    addBlock: function (model, beforeBlockId) {
                        var self = this,
                                iframe = this.getWindowIframe(),
                                blockWrapper = new BlockWrapperView({
                                    id: 'outer-block-' + model.id,
                                    storage: this.storage,
                                    controller: this.controller,
                                    model: model
                                });

                        //Attach element to DOM
                        if (beforeBlockId > 0) {
                            //FIXME: effect
                            iframe.jQuery('#outer-block-' + beforeBlockId).before(blockWrapper.render().el);
                        } else {
                            iframe.jQuery('#droppable-0').before(blockWrapper.render().el);
                        }
                        //Atach droppable event
                        self.droppable(model.id);
                        //Scroll to new block
                        iframe.jQuery('body').animate({
                            scrollTop: blockWrapper.$el.offset().top
                        }, 1000);

                        //Counting the amount of blocks to trigger 'pageLoad' event
                        (--this.blocksCounter === 0) ? this.trigger('page_loaded') : this.blocksCounter--;



                        return;

                        var iframe = this.getWindowIframe();
                        var blockWrapper = new BlockWrapperView({storage: this.storage, model: this.model});

                        iframe.jQuery('#builder-blocks').append(blockWrapper.render().el);
                        return;

                        var droppable = '<div id="droppable-' + blockView.model.id + '" class="droppable ui-droppable active-wait">' +
                                '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
                                '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
                                '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';

                        var cover = '<div onclick="parent.builder.builderLayout.viewPort.startEditBlock(' + blockView.model.id + ');" class="no-active-overlay"></div>';

                        var fullBlock = [jQuery(controlButtons), blockView.render().el, jQuery(droppable), jQuery(cover)];

                        if (afterBlockId && afterBlockId > 0) {
                            //Add controll buttons
                            var $block = jQuery('<div class="content-block content-fade" data-model-id="' + blockView.model.id + '"></div>');
                            iframe.jQuery('.content-block[data-model-id="' + blockView.model.id + '"]').append(fullBlock);

                            iframe.jQuery('.content-block[data-model-id="' + afterBlockId + '"]').after($block);


                            iframe.jQuery('body').animate({
                                scrollTop: $block.offset().top
                            }, 1000);
                        } else {
                            if (afterBlockId == 0) {
                                iframe.jQuery('#builder-blocks').prepend('<div class="content-block content-fade" data-model-id="' + blockView.model.id + '"></div>');
                                iframe.jQuery('.content-block[data-model-id="' + blockView.model.id + '"]').append(fullBlock);
                            } else {
                                iframe.jQuery('#builder-blocks').append('<div class="content-block" data-model-id="' + blockView.model.id + '"></div>');
                                iframe.jQuery('.content-block[data-model-id="' + blockView.model.id + '"]').append(fullBlock);
                            }
                        }

                        // create droppable event
                        this.droppable(blockView.model.id);

                        // default visible block
                        if (blockView.model.get('devices')) {
                            this.visibilityBlocks(blockView.model.id, blockView.model.get('devices').split(','));
                        }

                        // setting block height
                        builder.builderLayout.menu.resize();

                        // Trigger change
                        this.triggerBuilderBlock();
                    },
                    /**
                     * Create event change for iframe
                     * @returns {Event} change
                     */
                    triggerBuilderBlock: function () {
                        // Trigger change builder blocks for theme
                        var iframe = this.getWindowIframe();
                        iframe.jQuery('#builder-blocks').trigger('change');
                    },
                    /**
                     * DEPRECATED
                     * 
                     * Show settings current block
                     *
                     * @param {integer} blockId
                     */
                    editBlock: function (blockId) {
                        builder.builderLayout.menu.showSettings(blockId);
                    },
                    /**
                     * Remove block by id
                     * 
                     * @param {Integer} blockId
                     */
                    removeBlock: function (blockId) {
                        var alert = confirm("Are you sure you want to delete the block?");
                        if (!alert) {
                            return false;
                        }

                        var iframe = this.getWindowIframe();

                        // add class when delete block
                        iframe.jQuery('div[data-model-id="' + blockId + '"]').addClass('content-hide');

                        // remove from storage and DOM
                        builder.storage.delModel(blockId);
                        builder.storage.delBlockView(blockId);
                        builder.storage.delSettingsView(blockId);

                        // remove container block
                        setTimeout(function () {
                            iframe.jQuery('div[data-model-id="' + blockId + '"]').remove();
                        }, 1000);

                        builder.trigger('stop_edit_block');
                    },
                    /**
                     * Create droppable event by id
                     * 
                     * @param {integer} blockId
                     */
                    droppable: function (blockId) {
                        var iframe = this.getIframeContents();
                        var self = this;
                        iframe.find('#droppable-' + blockId).droppable({
                            activeClass: "ui-droppable-active",
                            hoverClass: "ui-droppable-hover",
                            tolerance: "pointer",
                            drop: function (event, ui) {
                                var dropElement = jQuery(this);
                                //get template id
                                var templateId = ui.draggable.attr("id").replace("preview-block-", "");
                                //get after id
                                var beforeId = dropElement.attr("id").replace("droppable-", "");
                                // add new block
                                self.controller.addNewBlock(templateId, beforeId);
                            }
                        });
                    },
                    /**
                     * Create default droppable in iframe
                     */
                    createDefaultDroppable: function () {
                        var iframe = this.getWindowIframe();
                        var droppable = _.template(this.storage.builderTemplates['block-droppable'])({"blockId": 0});
                        iframe.jQuery('#builder-blocks').append(iframe.jQuery(droppable));
                        this.droppable('0');
                    },
                    /**
                     * Add block onclick
                     */
                    clickBlockAdd: function (elementid) {
                        var afterId, iframe = this.getWindowIframe();

                        // get template id
                        var templateId = elementid.replace("preview-block-", "");

                        //Creating waiting block in bottom
                        //                var droppable = '<div id="droppable-' + block.model.id + '" class="droppable ui-droppable active-wait">' +
                        //                        '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
                        //                        '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
                        //                        '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';
                        //                iframe.jQuery('#builder-blocks').after(iframe.jQuery(droppable));

                        //Animation scrolling to the bottom of the block's container
                        if (iframe.jQuery('#builder-blocks .content-block:last-child').get(0)) {
                            var trident = !!navigator.userAgent.match(/Trident\/7.0/);
                            var net = !!navigator.userAgent.match(/.NET4.0E/);
                            var checkFoxDom = !!window.sidebar || trident && net ? 'html' : 'body';
                            iframe.jQuery(checkFoxDom).animate({
                                scrollTop: iframe.jQuery('#builder-blocks .content-block:last-child').offset().top + iframe.jQuery('#builder-blocks .content-block:last-child').height()
                            }, 1000, function () {
                                afterId = iframe.jQuery('#builder-blocks .content-block:last-child').data('model-id');
                                // add new block
                                builder.addNewBlock(templateId, afterId);
                            });
                        } else {
                            afterId = iframe.jQuery('#builder-blocks .content-block:last-child').data('model-id');
                            // add new block
                            builder.addNewBlock(templateId, afterId);
                        }

                        //
                        //                builder.storage.getTemplate(templateId, function (err, template) {
                        //                    self.getDefaultSettings(templateId, function (err, settings) {
                        //                        var model = BuilderUtils.createModel(settings),
                        //                                iframe = self.getWindowIframe();
                        //
                        //                        //add model to storage
                        //                        builder.storage.addModel(model);
                        //
                        //                        self.createBlock(model, template, function (err, block) {
                        //                            self.createSettings(block.model, function (err, view) {
                        //                                //Creating waiting block in bottom
                        //                                var droppable = '<div id="droppable-' + block.model.id + '" class="droppable ui-droppable active-wait">' +
                        //                                        '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
                        //                                        '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
                        //                                        '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';
                        //                                iframe.jQuery('#builder-blocks').after(iframe.jQuery(droppable));
                        //                                //Animation scrolling to the bottom of the block's container
                        //                                if (iframe.jQuery('#builder-blocks .content-block:last-child').get(0)) {
                        //                                    var trident = !!navigator.userAgent.match(/Trident\/7.0/);
                        //                                    var net = !!navigator.userAgent.match(/.NET4.0E/);
                        //                                    var IE11 = trident && net
                        //                                    var checkFoxDom = !!window.sidebar || trident && net ? 'html' : 'body';
                        //                                    iframe.jQuery(checkFoxDom).animate({
                        //                                        scrollTop: iframe.jQuery('#builder-blocks .content-block:last-child').offset().top + iframe.jQuery('#builder-blocks .content-block:last-child').height()
                        //                                    }, 1000, function () {
                        //                                        //Appending added block
                        //                                        builder.builderLayout.menu.addView(view, 270);
                        //                                        var afterBlockId = iframe.jQuery('.content-block:last-child').attr('data-model-id');
                        //                                        self.addBlock(block, afterBlockId);
                        //                                    });
                        //                                } else {
                        //                                    //Appending added block
                        //                                    builder.builderLayout.menu.addView(view, 270);
                        //                                    var afterBlockId = iframe.jQuery('.content-block:last-child').attr('data-model-id');
                        //                                    self.addBlock(block, afterBlockId);
                        //                                }
                        //
                        //
                        //                            });
                        //                        });
                        //                    });
                        //                });
                    },
                    setPreviewMode: function () {
                        this.previewMode = true;
                        this.getIframeContents().find('#builder-blocks').addClass('preview');
                    },
                    setEditMode: function () {
                        this.previewMode = false;
                        this.getIframeContents().find('#builder-blocks').removeClass('preview');
                    },
                    setDeviceMode: function (mode) {
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
                    resize: function () {
                        var size = {
                            'height': (this.previewMode ? 0 : 70),
                            'width': (this.previewMode ? 0 : 258)
                        };

                        jQuery('#builder-viewport').stop().animate({
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
                    /**
                     * DEPRECATED
                     * 
                     * Get array model ids blocks
                     * @returns {Array|getSort.blocks_ids}
                     */
                    getSort: function () {
                        var iframe = this.getWindowIframe(),
                                blocks = iframe.jQuery('.content-block'),
                                blocks_ids = [];

                        blocks.each(function (i, v) {
                            blocks_ids.push(jQuery(v).data('model-id'));
                        });

                        return blocks_ids;
                    },
                    getIframe: function () {
                        return this.$el.find('#builder-iframe');
                    },
                    /**
                     * Get iframe contents
                     * @returns {DOMElement}
                     */
                    getIframeContents: function () {
                        return this.getIframe().contents();
                    },
                    /**
                     * Get iframe documnet
                     * @returns {DOMElement}
                     */
                    getWindowIframe: function () {
                        return window.frames["builder-iframe"];
                    },
                    /**
                     * Change devices display
                     */
                    visibilityBlocks: function (blockId, devices) {
                        var iframe = this.getIframeContents();

                        var block = iframe.find("[data-model-id='" + blockId + "']");

                        block.removeClass(function (index, classes) {
                            var regex = /^visible-/;
                            return classes.split(/\s+/).filter(function (c) {
                                return regex.test(c);
                            }).join(' ');
                        });

                        for (var i = 0; i < devices.length; i++) {
                            block.addClass('visible-' + devices[i]);
                        }
                    }
                });
