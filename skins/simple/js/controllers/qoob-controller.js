/*global QoobUtils*/
var QoobController = Backbone.Router.extend({ // eslint-disable-line no-unused-vars
    routes: {
        "": "index", // Empty hash-tag
        "groups-:group(/)": "showGroup", // #groups/name
        "edit-:blockId(/)": "startEditBlock", // #groups/name
        "save-template(/)": "showSavePageTemplate",
        '*default': 'default'
    },
    isBack: false,
    initialize: function() {
        this.history = [];
    },
    currentUrl: function() {
        return Backbone.history.getFragment();
    },
    addHistory: function(url) {
        this.history.push(url);
    },
    getHistory: function() {
        var backUrl = Backbone.history.fragment;
        while (backUrl == Backbone.history.fragment) {
            backUrl = this.history.pop();
        }
        return backUrl;
    },
    default: function(args) {
        var fragment = args;

        // Delete "/" in the end
        if (fragment.charAt(fragment.length - 1) == '/') {
            fragment = fragment.substr(0, fragment.length - 1);
        }

        var path = fragment.split("/");

        if (path[0].indexOf('edit-') <= 0 && !(this.layout.getBlockView(path[0].split('-')[1]))) {
            this.navigate('', {
                trigger: true,
                replace: true
            });
        } else {
            this.addHistory(fragment);

            this.isBack = false;

            this.layout.navigate("edit", path.shift().split('-')[1], this.isBack);

            while (path.length > 0) {
                this.layout.navigate("inner", path.shift(), this.isBack);
            }

        }
    },
    backward: function() {
        this.isBack = true;
        // this.navigate(this.getHistory(), true);
        this.layout.backward(this.currentUrl());
    },
    index: function() {
        this.addHistory(Backbone.history.getFragment());
        this.layout.navigate("index", null, this.isBack);
        this.isBack = false;
    },
    showGroup: function(group) {
        this.addHistory(Backbone.history.getFragment());
        this.layout.navigate("group", group, this.isBack);
        this.isBack = false;
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
        this.layout.showSaveLoader();

        var json = JSON.parse(JSON.stringify(this.pageModel.toJSON()));
        json.version = window.QoobVersion;
        var html = '';
        var blocks = this.pageModel.get('blocks').models;
        for (var i = 0; i < blocks.length; i++) {
            var blockModel = blocks[i];
            var blockView = this.layout.getBlockView(blockModel.id);
            html += blockView.innerBlock.renderedTemplate;
        }

        this.storage.save(json, html, function(err, status) {
            // hide clock autosave
            self.layout.hideSaveLoader();
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
        this.layout.navigate("save-template", null, this.isBack);
        this.isBack = false;
    },
    addNewBlock: function(lib, block, afterId) {
        var blockConfig = this.storage.getBlockConfig(lib, block);
        this.addBlock(QoobUtils.getDefaultSettings(blockConfig, blockConfig.name), afterId);
    },
    addBlock: function(values, afterId, scroll) {
        scroll = (scroll === undefined) ? true : scroll;

        var model = QoobUtils.createModel(values);
        this.pageModel.addBlock(model, afterId);
        this.layout.addBlock(model, afterId);

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
                self.layout.scrollTo(model.id, position);
            }, 700);

        }
    },
    startEditBlock: function(blockId) {
        if (this.pageModel.get('blocks').get(blockId)) {
            this.addHistory(Backbone.history.getFragment());
            this.layout.navigate("edit", blockId, this.isBack);
        } else {
            this.navigate('', {
                trigger: true,
                replace: true
            });
        }
    },
    stopEditBlock: function() {
        this.layout.stopEditBlock();
        this.navigate('', {
            trigger: true
        });
    },
    load: function(blocks) {
        if (blocks.length === 0) {
            this.layout.triggerBlocksLoader();
        } else {
            for (var i = 0; i < blocks.length; i++) {
                this.addBlock(blocks[i], null, false);
            }
        }
    },
    deleteBlock: function(model) {
        this.pageModel.deleteBlock(model);
        this.layout.deleteBlock(model);
    },
    moveDownBlock: function(model) {
        this.pageModel.moveDown(model);
    },
    moveUpBlock: function(model) {
        this.pageModel.moveUp(model);
    },
    triggerIframe: function() {
        this.layout.triggerIframe();
    },
    changeLib: function(name) {
        this.layout.changeLib(name);
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
        this.layout.changeDefaultPage(event);
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
        this.layout.showImportExportWindow();
    },
    /**
     * Remove empty div for mobile
     */
    removeEmptyDraggableElement: function() {
        this.layout.removeEmptyDraggableElement();
    },
    showSwipeMenu: function() {
        this.layout.showSwipeMenu();
    },
    hideSwipeMenu: function() {
        this.layout.hideSwipeMenu();
    }
});