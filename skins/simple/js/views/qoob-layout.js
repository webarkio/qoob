/*global QoobSidebarView, QoobMenuView, QoobToolbarView, QoobEditModeButtonView, QoobViewportView, QoobImportExportView, AccordionFlipItemSettingsView, ImageCenterView, IconCenterView, VideoCenterView, Hammer, isMobile*/
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
            var self = this;

            this.inner = null;
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

            // Init swipe
            var hammer = new Hammer.Manager(document.documentElement, {
                touchAction: 'auto',
                inputClass: Hammer.SUPPORT_POINTER_EVENTS ? Hammer.PointerEventInput : Hammer.TouchInput,
                recognizers: [
                    [Hammer.Swipe, {
                        direction: Hammer.DIRECTION_HORIZONTAL
                    }]
                ]
            });

            hammer.on('swipeleft swiperight', function(e) {
                if (e.type === 'swipeleft') {
                    self.hideSwipeMenu();
                } else if (e.type === 'swiperight') {
                    self.showSwipeMenu();
                }
            });

            var device = this.getDeviceState();

            if (device === 'mobile') {
                self.showSwipeMenu();
            }

            var swipeResize = function() {
                var container = self.$el;
                container.removeClass('mobile tablet desktop');

                var device = self.getDeviceState();

                if (device === 'mobile') {
                    container.addClass('mobile');
                } else if (device === 'tablet') {
                    container.addClass('tablet');
                } else {
                    container.addClass('desktop');
                }
            }

            Hammer.on(window, "resize", function() {
                swipeResize();
            });

            swipeResize();
        },
        navigate: function(page, param, isBack) {
            if (page == "index") {
                this.menu.showIndex(isBack);
                this.stopEditBlock();
            } else if (page == "save-template") {
                this.stopEditBlock();
                this.menu.hideNotice();
                this.menu.showSavePageTemplate();
            } else if (page == "group") {
                this.menu.showIndex(isBack);
                this.stopEditBlock();
                this.menu.showGroup(param);
            } else if (page == "edit") {
                this.startEditBlock(param, isBack);
                this.scrollTo(param);
            } else if (page == "inner") {
                var model, accordionView, accordionItem, accordion,
                    // parentSide = this.menu.currentSide,
                    parentView = this.menu.currentView,
                    currentId = parentView.name + "_" + param,
                    innerView = this.menu.getView(currentId);

                var fieldName = param.split("-")[0]; //bgImageUrl
                var fieldIndex = param.split("-")[1]; //null

                var settings = _.findWhere(parentView.settings, { name: fieldName });
                // var defaults = parentView.defaults[fieldName];

                if (fieldIndex) {
                    model = parentView.model.get(fieldName).get(fieldIndex);
                } else {
                    model = parentView.model;
                }

                if (settings.type == "accordion_flip") {
                    if (!innerView) {
                        accordionView = _.find(parentView.fields, function(view) {
                            if (view.settings.name == fieldName) {
                                return view;
                            }
                        });

                        accordionItem = accordionView.getAccordionMenuViews(fieldIndex);

                        innerView = new AccordionFlipItemSettingsView({
                            name: currentId,
                            storage: this.storage,
                            controller: this.controller,
                            model: model,
                            settings: settings.settings,
                            defaults: accordionItem.defaults,
                            parent: parentView,
                            side: parentView.side
                        });
                        innerView.side = innerView;

                        this.menu.setInnerSettingsView(innerView);
                    }

                    this.menu.currentView = innerView;

                    this.menu.showInnerSettingsView(currentId, isBack);

                    // hook for field accordion
                    accordion = innerView.$el.find('.accordion');
                    if (accordion.length > 0) {
                        accordion.accordion("option", "active", false);
                    }
                } else if (settings.type == "accordion") {
                    accordionView = _.find(parentView.fields, function(view) {
                        if (view.settings.name == fieldName) {
                            return view;
                        }
                    });

                    accordionItem = accordionView.getAccordionMenuViews(fieldIndex);

                    if (accordionItem != undefined) {
                        this.menu.currentView = accordionItem.settingsView;
                    } else {
                        this.controller.navigate('', {
                            trigger: true,
                            replace: true
                        });
                    }

                    accordion = accordionView.$el.find('.accordion');

                    var index = null;
                    accordion.find('.field-accordion-item').each(function(i, el) {
                        if (jQuery(el).data('model-id') == fieldIndex) {
                            index = i;
                        }
                    });

                    accordion.accordion("option", "active", index);
                } else if (settings.type == "image") {
                    if (!innerView) {
                        var imageView = _.find(parentView.fields, function(view) {
                            if (view.settings.name == fieldName) {
                                return view;
                            }
                        });

                        innerView = new ImageCenterView({
                            name: currentId,
                            storage: this.storage,
                            controller: this.controller,
                            model: model,
                            curSrc: imageView.getValue(),
                            assets: this.storage.getAssets(),
                            tags: imageView.tags ? imageView.tags.join(', ') : '',
                            iframeUrl: imageView.getIframeUrl(),
                            cb: imageView.changeImage.bind(imageView),
                            parent: parentView
                        });
                        innerView.side = innerView;

                        this.menu.setInnerSettingsView(innerView);
                    }
                    
                    this.menu.showInnerSettingsView(currentId, isBack);
                } else if (settings.type == "icon") {
                    if (!innerView) {
                        var iconView = _.find(parentView.fields, function(view) {
                            if (view.settings.name == fieldName) {
                                return view;
                            }
                        });

                        var iconObject = iconView.findByClasses(iconView.getValue());

                        innerView = new IconCenterView({
                            name: currentId,
                            storage: this.storage,
                            controller: this.controller,
                            model: model,
                            icon: iconObject ? { classes: iconObject.classes, tags: iconObject.tags } : '',
                            icons: iconView.icons,
                            cb: iconView.changeIcon.bind(iconView),
                            parent: parentView
                        });
                        innerView.side = innerView;

                        this.menu.setInnerSettingsView(innerView);
                    }

                    this.menu.showInnerSettingsView(currentId, isBack);
                } else if (settings.type == "video") {
                    if (!innerView) {
                        var videoView = _.find(parentView.fields, function(view) {
                            if (view.settings.name == fieldName) {
                                return view;
                            }
                        });

                        innerView = new VideoCenterView({
                            name: currentId,
                            storage: this.storage,
                            controller: this.controller,
                            model: model,
                            src: videoView.getValue(),
                            assets: videoView.storage.getAssets(),
                            tags: videoView.tags ? videoView.tags.join(', ') : '',
                            cb: videoView.changeVideo.bind(videoView),
                            parent: parentView
                        });
                        innerView.side = innerView;

                        this.menu.setInnerSettingsView(innerView);
                    }

                    this.menu.showInnerSettingsView(currentId, isBack);
                }
            }
        },
        backward: function(url) {
            if (url.length == 0) {
               window.location = window.location.origin;
            } else if (url.length > 0)  {
                var hash = url.split("/");
                if (hash.length > 1) {
                    hash.pop();               
                    var currentViewParent = this.menu.currentView.parent;
                    if (currentViewParent.$el.hasClass('field-accordion-settings')) {
                        hash.pop();
                    }

                    this.controller.navigate(hash.join('/'), {
                        trigger: true,
                        replace: true
                    });
                }else {
                    var part = ['edit', 'group', 'save-template'];

                    for (var i = 0; i < part.length; i++) {
                        if (hash[0].indexOf(part[i]) !== -1) {
                            this.controller.navigate('', {
                                trigger: true,
                                replace: true
                            });
                            break;
                        }
                    }
                }
            }
        },
        scrollTo: function(modelId, position) {
            this.viewPort.scrollTo(modelId, position);
        },
        /**
         * Render qoob view
         * @returns {Object}
         */
        render: function() {
            this.sidebar.$el.html([this.toolbar.render().el, this.menu.render().el]);
            this.$el.html([this.sidebar.render().el, this.viewPort.render().el, this.ImportExport.render().el, this.editModeButton.render().el]);
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
            this.sidebar.setEditMode();
            this.viewPort.setEditMode();
        },
        setDeviceMode: function(mode) {
            this.viewPort.setDeviceMode(mode);
        },
        startEditBlock: function(blockId, isBack) {
            this.menu.startEditBlock(blockId, isBack);
            this.viewPort.startEditBlock(blockId);
        },
        stopEditBlock: function() {
            this.viewPort.stopEditBlock();
        },
        showSaveLoader: function() {
            // show clock autosave
            this.toolbar.showSaveLoader();
        },
        hideSaveLoader: function() {
            // hide clock autosave
            this.toolbar.hideSaveLoader();
        },
        getBlockView: function(modelId) {
            return this.viewPort.getBlockView(modelId);
        },
        addBlock: function(model, afterId) {
            this.menu.addSettings(model);
            this.viewPort.addBlock(model, afterId);
        },
        deleteBlock: function(model) {
            this.viewPort.delBlockView(model);
            this.menu.deleteSettings(model);
            this.viewPort.triggerIframe();
        },
        triggerIframe: function() {
            this.viewPort.triggerIframe();
        },
        changeLib: function(name) {
            this.storage.currentLib = name;
            this.menu.hideLibsExcept(name);
        },
        changeDefaultPage: function(event) {
            this.viewPort.changeDefaultPage(event);
        },
        showImportExportWindow: function() {
            this.ImportExport.showImportExportWindow();
        },
        removeEmptyDraggableElement: function() {
            this.viewPort.removeEmptyDraggableElement();
        },
        showSwipeMenu: function() {
            this.sidebar.showSwipeMenu();
        },
        hideSwipeMenu: function() {
            this.sidebar.hideSwipeMenu();
            this.menu.hideSwipeMenu();
        },
        triggerBlocksLoader: function() {
            this.viewPort.trigger('blocks_loaded');
        },
        getDeviceState: function() {
            var windowWidth = jQuery(window).width(),
                device;

            if (isMobile.mobile || (windowWidth >= 320 && windowWidth <= 767)) {
                device = 'mobile';
            } else if (isMobile.tablet || (windowWidth >= 768 && windowWidth <= 991)) {
                device = 'tablet';
            } else if (windowWidth >= 992) {
                device = 'desktop';
            }

            return device;
        }
    });