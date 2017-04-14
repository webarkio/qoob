/*global QoobUtils*/
var QoobController = Backbone.Router.extend({ // eslint-disable-line no-unused-vars
    routes: {
        "index": "index",
        "": "index", // Empty hash-tag
        "groups/:group": "showGroup", // #groups/name
        "edit/:blockId": "startEditBlock", // #groups/name
        "save-template": "showSavePageTemplate"
    },
    index: function() {
        this.layout.menu.showIndex();
        this.layout.stopEditBlock();
        this.layout.toolbar.logoRotation('side-0');
    },
    showGroup: function(group) {
        this.layout.menu.showGroup(group);
        this.layout.toolbar.logoRotation('side-90');
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
        this.layout.menu.rotateForward('save-template');
        this.layout.menu.hideNotice();
        this.layout.toolbar.logoRotation('side-90');
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
            this.navigate('index');
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
        this.layout.menu.addView(view);
        this.layout.menu.rotateForward(name, function() {
            view.$el.trigger('shown');
        });
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
    }
});
