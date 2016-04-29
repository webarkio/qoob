/**
 * Create view for viewport in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderViewportView = Backbone.View.extend(
        /** @lends BuilderMenuGroupsView.prototype */{
            id: "builder-viewport",
            className: "pc",
            tpl: '',
            builder: null,
            iframeLoaded: false,
            iframeLoadedFunctions: [],
            /**
             * View menu
             * @class BuilderMenuView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (builder) {
                this.builder = builder;
                this.listenTo(Backbone, 'rotate', this.toggleActiveBlock);
            },
            /**
             * Render menu
             * @returns {Object}
             */
            render: function () {
                var self = this;
                this.builder.storage.getBuilderTemplate('builder-viewport', function (err, data) {
                    self.tpl = _.template(data);
                    self.$el.html(self.tpl({"postId" : this.builder.storage.pageId}));
                });
                return this;
            },
            /**
             * Shadowing not active blocks, when edit button is hovered
             * or we are in the block's settigns
             * 
             */
            toggleActiveBlock: function () {
                var iframe = this.getWindowIframe(),
                    curSide = this.builder.builderLayout.menu.currentSide,
                    blocks = iframe.jQuery('.content-block'),
                    curRotate = this.builder.builderLayout.menu.currentRotateId,
                    blockId = curRotate.match(/\d+/i) ? curRotate.match(/\d+/i)[0] : null;
                
                if((curSide === 'side-0' || curSide === 'side-90') && !blockId) {
                    blocks.removeClass('no-active');
                } else {
                    var curBlock = iframe.jQuery('.content-block[data-model-id=' + blockId + ']');
                    if(curBlock.get(0)) {
                        blocks.addClass('no-active');
                        curBlock.removeClass('no-active');
                    }                 
                }
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

                this.builder.storage.getConfig(templateId, function (err, config) {
                    var tplAdapter = config.blockTemplateAdapter || this.builder.options.blockTemplateAdapter;
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
                this.builder.storage.getConfig(model.get('template'), function (err, config) {
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
             * Get default settings
             *
             * @param {integer} templateId
             * @param {getDefaultSettingsCallback} cb - A callback to run.
             */
            getDefaultSettings: function (templateId, cb) {
                this.builder.storage.getConfig(templateId, function (err, data) {
                    var config = {};
                    var settings = data.settings;
                    for (var i = 0; i < settings.length; i++) {
                        config[settings[i].name] = settings[i].default;
                    }
                    config.template = templateId;
                    cb(null, config);
                });
            },
            /**
             * Add block
             * 
             * @param {Object} block
             * @param {integer} afterBlockId
             */
            addBlock: function (block, afterBlockId) {
                var iframe = this.getWindowIframe();

                var blockEditId = '"settings-block-' + block.model.id + '"';
                var blockEditId = '"settings-block-' + block.model.id + '"';
                var controlButtons = '<div class="control-block-button">' +
                        "<a onclick='parent.builder.builderLayout.menu.rotate(" + blockEditId + "); return false;' class='edit' href='#'></a>" +
                        '<a onclick="parent.builder.builderLayout.viewPort.removeBlock(' + block.model.id + '); return false;"  class="remove" href="#"></a>' +
                        '</div>';
                var droppable = '<div id="droppable-' + block.model.id + '" class="droppable">' +
                        '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
                        '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
                        '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';
                
                var cover = '<div class="no-active-overlay"></div>';
                
                var fullBlock = [jQuery(controlButtons), block.render().el, jQuery(droppable), jQuery(cover)];

                if (afterBlockId && afterBlockId > 0) {
                    //Add controll buttons
                    var $block = jQuery('<div class="content-block content-fade" data-model-id="' + block.model.id + '"></div>');
                    iframe.jQuery('.content-block[data-model-id="' + afterBlockId + '"]').after($block);
                    iframe.jQuery('.content-block[data-model-id="' + block.model.id + '"]').append(fullBlock);

                    iframe.jQuery('body').animate({
                        scrollTop: $block.offset().top
                    }, 1000);
                } else {
                    if (afterBlockId == 0) {
                        iframe.jQuery('#builder-blocks').prepend('<div class="content-block content-fade" data-model-id="' + block.model.id + '"></div>');
                        iframe.jQuery('.content-block[data-model-id="' + block.model.id + '"]').append(fullBlock);
                    } else {
                        iframe.jQuery('#builder-blocks').append('<div class="content-block" data-model-id="' + block.model.id + '"></div>');
                        iframe.jQuery('.content-block[data-model-id="' + block.model.id + '"]').append(fullBlock);
                    }
                }

                // create droppable event
                this.droppable(block.model.id);

                // default visible block
                if (block.model.get('devices')) {
                    this.builder.iframe.visibilityBlocks(block.model.id, block.model.get('devices').split(','));
                }

                // setting block height
                this.builder.builderLayout.menu.resize();

                // Trigger change
                this.triggerBuilderBlock();

                // when added block hide loader
                this.builder.loader.hideWaitBlock();

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
                this.builder.builderLayout.menu.showSettings(blockId);
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

                // if settings is open
                if (jQuery('#settings-block-' + blockId).css('display') != 'none') {
                    // logo rotation
//        this.builder.toolbar.logoRotation(-90);
                }

                // remove from storage and DOM
                this.builder.storage.delModel(blockId);
                this.builder.storage.delBlockView(blockId);
                this.builder.storage.delSettingsView(blockId);

                // remove container block
                setTimeout(function () {
                    iframe.jQuery('div[data-model-id="' + blockId + '"]').remove();
                }, 1000);
            },
            /**
             * Create droppable event by id
             * 
             * @param {integer} blockId
             */
            droppable: function (blockId) {
                var self = this;
                var iframe = this.getIframeContents();

                iframe.find('#droppable-' + blockId).droppable({
                    activeClass: "ui-droppable-active",
                    hoverClass: "ui-droppable-hover",
                    tolerance: "pointer",
                    drop: function (event, ui) {
                        var dropElement = jQuery(this);

                        jQuery(event.target).addClass('active-wait');

                        //get template id
                        var templateId = ui.draggable.attr("id").replace("preview-block-", "");
                        self.builder.storage.getTemplate(templateId, function (err, template) {
                            self.getDefaultSettings(templateId, function (err, config) {
                                var model = BuilderUtils.createModel(config);

                                //add model to storage
                                self.builder.storage.addModel(model);

                                self.createBlock(model, template, function (err, block) {
                                    self.createSettings(block.model, function (err, view) {
                                        self.builder.builderLayout.menu.addView(view, 270);
                                        var afterBlockId = dropElement.attr("id").replace("droppable-", "");
                                        self.addBlock(block, afterBlockId);
                                    });
                                });
                            });
                        });
                    }
                });
            },
            /**
             * Create default droppable in iframe
             */
            createDefaultDroppable: function () {
                var iframe = this.getWindowIframe();
                var droppable = '<div id="droppable-0" class="droppable">' +
                        '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
                        '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
                        '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';
                iframe.jQuery('#builder-blocks').before(iframe.jQuery(droppable));
                this.droppable('0');
            },
            /**
             * Add block onclick
             */
            clickBlockAdd: function (elementid) {
                var self = this;
                var templateId = elementid.replace("preview-block-", "");
                this.builder.storage.getTemplate(templateId, function (err, template) {
                    self.getDefaultSettings(templateId, function (err, settings) {
                        var model = BuilderUtils.createModel(settings),
                                iframe = self.getWindowIframe();

                        //add model to storage
                        self.builder.storage.addModel(model);

                        self.createBlock(model, template, function (err, block) {
                            self.createSettings(block.model, function (err, view) {
                                //Creating waiting block in bottom
                                var droppable = '<div id="droppable-' + block.model.id + '" class="droppable ui-droppable active-wait">' +
                                        '<div class="dropp-block"><i class="plus"></i><span>Drag here to creative new block</span></div>' +
                                        '<div class="wait-block"><div class="clock"><div class="minutes-container"><div class="minutes"></div></div>' +
                                        '<div class="seconds-container"><div class="seconds"></div></div></div><span>Please wait</span></div></div></div>';
                                iframe.jQuery('#builder-blocks').after(iframe.jQuery(droppable));
                                //Animation scrolling to the bottom of the block's container
                                if (iframe.jQuery('#builder-blocks .content-block:last-child').get(0)) {
                                    var trident = !!navigator.userAgent.match(/Trident\/7.0/);
                                    var net = !!navigator.userAgent.match(/.NET4.0E/);
                                    var IE11 = trident && net
                                    var checkFoxDom = !!window.sidebar || trident && net ? 'html' : 'body';
                                    iframe.jQuery(checkFoxDom).animate({
                                        scrollTop: iframe.jQuery('#builder-blocks .content-block:last-child').offset().top + iframe.jQuery('#builder-blocks .content-block:last-child').height()
                                    }, 1000, function () {
                                        //Appending added block
                                        self.builder.builderLayout.menu.addView(view, 270);
                                        var afterBlockId = iframe.jQuery('.content-block:last-child').attr('data-model-id');
                                        self.addBlock(block, afterBlockId);
                                    });
                                } else {
                                    //Appending added block
                                    self.builder.builderLayout.menu.addView(view, 270);
                                    var afterBlockId = iframe.jQuery('.content-block:last-child').attr('data-model-id');
                                    self.addBlock(block, afterBlockId);
                                }


                            });
                        });
                    });
                });
            },
            /**
             * Create blocks
             * 
             * @param {Array} data
             */
            create: function (data) {
                var self = this;

                self.createDefaultDroppable();
                function loop(i) {
                    if (i < data.length) {
                        this.builder.storage.getTemplate(data[i].get('template'), function (err, template) {
                            self.createBlock(data[i], template, function (err, block) {
                                self.createSettings(block.model, function (err, view) {
                                    self.builder.builderLayout.menu.addView(view, 270);
                                    self.addBlock(block);
                                    self.builder.loader.sub();
                                    loop(i + 1);
                                });
                            });
                        });
                    }
                }

                // Start create
                loop(0);
            },
            /**
             * Resize builder content
             */
            resize: function () {
                var hideBuilder = {
                    'height': (jQuery('.hide-builder').hasClass('active') ? 0 : 70),
                    'width': (jQuery('.hide-builder').hasClass('active') ? 0 : 258)
                };

                jQuery('#builder-content').stop().animate({
                    height: jQuery(window).height() - hideBuilder.height,
                    top: hideBuilder.height,
                    width: jQuery(window).width() - hideBuilder.width,
                    left: hideBuilder.width
                });
            },
            /**
             * Resize iframe
             */
            resizeIframe: function () {
                // Set size iframe
                var hideBuilder = (jQuery('.hide-builder').hasClass('active') ? 0 : 70);

                var height = jQuery(window).height() - hideBuilder,
                        width;

                width = this.$el.hasClass('pc') ? '100%' : jQuery('#builder-iframe').width();

                this.$el.find('#builder-iframe').height(height).width(width);
            },
            /**
             * Get array model ids blocks
             * @returns {Array|getSort.blocks_ids}
             */
            getSort: function () {
                var iframe = this.getWindowIframe(),
                        blocks = iframe.jQuery('.content-block'), blocks_ids = [];

                blocks.each(function (i, v) {
                    blocks_ids.push(jQuery(v).data('model-id'));
                });

                return blocks_ids;
            },
            /**
             * Save page data
             */
            save: function () {
                var self = this, html = '', json = [];

                // postion blocks on page
                var sort = this.getSort();

                this.builder.loader.showAutosave();

                for (var i = 0; i < sort.length; i++) {
                    for (var j = 0; j < this.builder.storage.blockViewData.length; j++) {
                        if (sort[i] == this.builder.storage.blockViewData[j].model.id) {
                            html += this.builder.storage.blockViewData[j].render_template;
                            json.push(JSON.parse(JSON.stringify(this.builder.storage.blockViewData[j].model)));
                        }
                    }
                }

                this.builder.storage.save(json, html, function (err, state) {
                    self.builder.loader.hideAutosave();
                });
            },
            /**
             * Get iframe contents
             * @returns {DOMElement}
             */
            getIframeContents: function () {
                return this.$el.find('#builder-iframe').contents();
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