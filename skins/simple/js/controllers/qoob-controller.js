/*global QoobUtils*/
var QoobController = Backbone.Router.extend({ // eslint-disable-line no-unused-vars
    routes: {
        "": "index", // Empty hash-tag
        "index": "index",
        "groups-:group(/)": "showGroup", // #groups/name
        "edit-:blockId(/)": "startEditBlock", // #groups/name
        "save-template(/)": "showSavePageTemplate",
        '*default': 'default'
    },
    initialize: function() {
        this.history = [];
        // this.on("route", this.storeRoute);
    },
    storeRoute: function() {
        // console.log(Backbone.history.fragment);
        this.history.push(Backbone.history.fragment);
    },
    default: function(args) {
        var fragment = args, viewSettings, fields;

        if (fragment.charAt(fragment.length - 1) == '/') {
            fragment = fragment.substr(0, fragment.length - 1);
        }

        var path = fragment.split("/");

        if (path[0] === 'edit' && path[1] !== undefined) {

            var navigatePath = path[0] + '/' + path[1];

            this.navigate(navigatePath, {
                trigger: false
            });

            var getFieldByPath = function(fields, path) {
              return _.find(fields, function(field){
                    return field.settings.name == path;
                });
            } 

            viewSettings = this.layout.menu.getSettingsView(path[1]);
            fields = viewSettings.settingsBlock.fields;

            path = path.slice(2);

            for (var i = 0; i < path.length; i++) {
                var item = getFieldByPath(fields, path[i]);

                if (item === undefined) {
                    this.navigate(navigatePath, {
                        trigger: false
                    });
                    break;
                }

                if (item.settings.type === 'accordion' && item.settings.viewType === 'flip') {
                    // navigatePath += '/' + path[i] + '/' + path[i + 1];

                    item.$el.find('.field-accordion__settings').eq(path[i+1]).trigger('click');

                    var modelId = item.$el.find('.field-accordion__settings').eq(path[i + 1]).data('model-id');

                    viewSettings = this.layout.menu.getSettingsView(modelId);
                    fields = viewSettings.settingsView.fields;

                    i++;
                    continue;
                } else {
                    // navigatePath += '/' + path[i];

                    // if (navigatePath !== Backbone.history.fragment) {
                    //     this.navigate(navigatePath, {
                    //         trigger: false
                    //     });
                    // }

                    jQuery(item.$el.find('.show-media-center')[0]).trigger('click');
                }
            }
        } else {
            this.index();
        }
    },
    // execute: function(callback, args) {
    //   // args.pop();
    //   // if (callback) callback.apply(this, args);

    //   console.log(args);
    // },
    backward: function() {
        // console.log(this.history[this.history.length - 1]);

        // if (this.history.length > 0) {
        //     this.navigate(this.history[this.history.length - 2], false);
        //     this.history.splice(-2, 2);
        //     console.log(this.history);
        //     this.history.pop();
        // } else {
        //     this.navigate('', {
        //         trigger: true,
        //         replace: true
        //     });
        // }


        // window.history.back();

        // console.log(Backbone.history.history);

        // Backbone.history.history.back();

        var path = Backbone.history.getFragment();

        if (path.charAt(path.length - 1) == '/') {
            path = path.substr(0, path.length - 1);
        }

        path = path.split('/');

        if (path.length > 0) {
            var lastPath = path[path.length - 1];
            var beforeLastPath = path[path.length - 2];
            var newPath = path.slice(0, -1);

            this.navigate(newPath.join('/'), false);

            this.menu.rotate(beforeLastPath, 'back');
        }
    },
    index: function() {
        this.layout.menu.showIndex();
        this.layout.stopEditBlock();
    },
    showGroup: function(group) {
        this.layout.menu.showGroup(group);
    },
    setLayout: function(layout) {
        this.layout = layout;
    },
    setPageModel: function(model) {
        this.pageModel = model;
    },
    setStorage: function(storage) {
        this.storage = storage;
    },
    setPreviewMode: function() {
        this.layout.setPreviewMode();
    },
    setEditMode: function() {
        this.layout.setEditMode();
    },
    setDeviceMode: function(mode) {
        this.layout.setDeviceMode(mode);
    },
    /**
     * Autosave page data for interval
     * @param {Boolean} autosave
     */
    setAutoSave: function(autosave) {
        this.autosave = autosave;

        var self = this;
        if (this.autosave) {
            var intervalId = setInterval(function() {
                if (self.autosave) {
                    self.save();
                } else {
                    clearInterval(intervalId);
                }
            }, 60000);
        }
    },
    /**
     * Save page data
     * @param {createBlockCallback} cb - A callback to run.
     */
    save: function(cb) {
        var self = this;

        // show clock autosave
        this.layout.toolbar.showSaveLoader();

        var json = JSON.parse(JSON.stringify(this.pageModel.toJSON()));
        json.version = window.QoobVersion;
        var html = '';
        var blocks = this.pageModel.get('blocks').models;
        for (var i = 0; i < blocks.length; i++) {
            var blockModel = blocks[i];
            var blockView = this.layout.viewPort.getBlockView(blockModel.id);
            html += blockView.innerBlock.renderedTemplate;
        }

        this.storage.save(json, html, function(err, status) {
            // hide clock autosave
            self.layout.toolbar.hideSaveLoader();
            // Make sure the callback is a function​
            if (typeof cb === "function") {
                // Call it, since we have confirmed it is callable​
                cb(err, status);
            }
        });
    },
    /**
     * Out of the Qoob
     */
    exit: function() {
        var self = this;
        if (this.autosave) {
            this.save(function() {
                self.storage.driver.exit(self.storage.pageId);
            });
        } else {
            this.storage.driver.exit(this.storage.pageId);
        }
    },
    showSavePageTemplate: function() {
        this.layout.menu.showSide('left', 'save-template');
        this.layout.menu.hideNotice();
        this.layout.stopEditBlock();
    },
    addNewBlock: function(lib, block, afterId) {
        var blockConfig = this.storage.getBlockConfig(lib, block);

        this.addBlock(QoobUtils.getDefaultSettings(blockConfig, blockConfig.name), afterId);
    },
    addBlock: function(values, afterId, scroll) {
        scroll = (scroll === undefined) ? true : scroll;

        var model = QoobUtils.createModel(values);

        this.pageModel.addBlock(model, afterId);
        this.layout.menu.addSettings(model);
        this.layout.viewPort.addBlock(model, afterId);

        if (scroll) {
            var self = this,
                position,
                indexModel = this.pageModel.get('blocks').indexOf(model),
                modelBelove = this.pageModel.get('blocks').at(indexModel + 1);

            if (indexModel === 0) {
                position = 'top';
            } else if (this.pageModel.get('blocks').length > 1 && modelBelove === undefined) {
                position = 'bottom';
            } else {
                position = false;
            }

            setTimeout(function() {
                self.scrollTo(model.id, position);
            }, 700);

        }
    },
    startEditBlock: function(blockId) {
        if (this.pageModel.get('blocks').get(blockId)) {
            this.layout.startEditBlock(blockId);
            this.scrollTo(blockId);
        } else {
            this.navigate('index', {
                trigger: true,
                replace: true
            });
        }
    },
    stopEditBlock: function() {
        this.layout.stopEditBlock();
        this.navigate('index', {
            trigger: true
        });
    },
    load: function(blocks) {
        if (blocks.length === 0) {
            this.layout.viewPort.trigger('blocks_loaded');
        } else {
            for (var i = 0; i < blocks.length; i++) {
                this.addBlock(blocks[i], null, false);
            }
        }
    },
    setInnerSettingsView: function(view) {
        var name = view.$el.data('side-id');

        //Add view to the qoob side
        if (!!this.layout.menu.settingsViewStorage[name]) {
            this.deleteInnerSettingsView(name);
        }

        this.layout.menu.addView(view, 'left');
        this.layout.menu.showSide('left', name);

        view.$el.trigger('shown');
        this.layout.menu.settingsViewStorage[name] = view;
    },
    deleteInnerSettingsView: function(name) {
        this.layout.menu.delView(name);
    },
    deleteBlock: function(model) {
        this.pageModel.deleteBlock(model);
        this.layout.viewPort.delBlockView(model);
        this.layout.menu.deleteSettings(model);
        this.triggerIframe();
    },
    moveDownBlock: function(model) {
        this.pageModel.moveDown(model);
    },
    moveUpBlock: function(model) {
        this.pageModel.moveUp(model);
    },
    triggerIframe: function() {
        this.layout.viewPort.triggerIframe();
    },
    changeLib: function(name) {
        this.storage.currentLib = name;
        this.layout.menu.hideLibsExcept(name);
    },
    /**
     * Scroll to block
     */
    scrollTo: function(modelId, position) {
        this.layout.viewPort.scrollTo(modelId, position);
    },
    /**
     * Get current params from Backbone.history.fragment
     */
    current: function() {
        var Router = this,
            fragment = Backbone.history.fragment,
            routes = _.pairs(Router.routes),
            route = null,
            params = null,
            matched;

        matched = _.find(routes, function(handler) {
            route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
            return route.test(fragment);
        });

        if (matched) {
            // NEW: Extracts the params using the internal
            // function _extractParameters 
            params = Router._extractParameters(route, fragment);
            route = matched[1];
        }

        return {
            route: route,
            fragment: fragment,
            params: params
        };
    },
    /**
     * Create page template
     */
    createPageTemplate: function(templateInfo, cb) {
        var dataPage = JSON.parse(JSON.stringify(this.pageModel.toJSON()));
        var newTemplate = _.extend(templateInfo, dataPage);

        if (dataPage.blocks.length > 0 && templateInfo.title !== '') {
            this.storage.createPageTemplate(newTemplate, function(error) {
                cb(error, status);
            });
        } else {
            var err = {};
            if (templateInfo.title === '') {
                err.title = true;
            }
            if (dataPage.blocks.length === 0) {
                err.blocks = true;
            }
            cb(err);
        }
    },
    /**
     * Remove template
     */
    removeTemplateBlock: function(id) {
        this.storage.removePageTemplate(id);
    },
    /**
     * Change default blank viewport when blocks is null
     */
    changeDefaultPage: function(event) {
        this.layout.viewPort.changeDefaultPage(event);
    },
    /**
     * Remove page data
     */
    removePageData: function() {
        var self = this;
        _.each(_.clone(this.pageModel.get('blocks').models), function(model) {
            self.deleteBlock(model);
        });
    },
    /**
     * Show import/export window
     */
    showImportExportWindow: function() {
        this.layout.ImportExport.showImportExportWindow();
    },
    /**
     * Remove empty div for mobile
     */
    removeEmptyDraggableElement: function() {
        this.layout.viewPort.removeEmptyDraggableElement();
    },
    /**
     * Show menu sidebar
     */
    showSwipeMenu: function() {
        this.layout.menu.showSwipeMenu();
    },
    /**
     * Hide menu sidebar
     */
    hideSwipeMenu: function() {
        this.layout.menu.hideSwipeMenu();
    }
});