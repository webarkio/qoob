var QoobController = Backbone.Router.extend({
    routes: {
        "index": "index",
        "groups/:group": "showGroup", // #groups/name
        "edit/:blockId": "startEditBlock", // #groups/name
    },
    index: function () {
        this.layout.menu.showIndex();
        this.layout.toolbar.logoRotation('side-0');
    },
    showGroup: function (group) {
        this.layout.menu.showGroup(group);
        this.layout.toolbar.logoRotation('side-90');
    },
    setLayout: function (layout) {
        this.layout = layout;
    },
    setPageModel: function (model) {
        this.pageModel = model;
    },
    setStorage: function (storage) {
        this.storage = storage;
    },
    setPreviewMode: function () {
        this.layout.setPreviewMode();
    },
    setEditMode: function () {
        this.layout.setEditMode();
    },
    setDeviceMode: function (mode) {
        this.layout.setDeviceMode(mode);
    },
    /**
     * Autosave page data for interval
     * @param {Boolean} autosave
     */
    setAutoSave: function (autosave) {
        this.autosave = autosave;

        var self = this;
        if (this.autosave) {
            var intervalId = setInterval(function () {
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
    save: function (cb) {
        var self = this;

        // show clock autosave
        this.layout.toolbar.showSaveLoader();

        var json = JSON.parse(JSON.stringify(this.pageModel.toJSON()));
        var html = '';
        var blocks = this.pageModel.get('blocks').models;
        for (var i = 0; i < blocks.length; i++) {
            var blockModel = blocks[i];
            var blockView = this.layout.viewPort.getBlockView(blockModel.id);
            html += blockView.innerBlock.renderedTemplate;
        }

        this.storage.save(json, html, function (err, status) {
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
    exit: function () {
        var self = this;
        if (this.autosave) {
            this.save(function (err, status) {
                self.storage.driver.exit(self.storage.pageId);
            });
        } else {
            this.storage.driver.exit(this.storage.pageId);
        }
    },
    addNewBlock: function (templateId, afterId) {
        this.addBlock(QoobUtils.getDefaultSettings(this.storage.qoobData.items, templateId), afterId);
    },
    addBlock: function (values, afterId) {
        var model = QoobUtils.createModel(values);
        this.pageModel.addBlock(model, afterId);
        this.scrollTo(model.id);
        // Remove empty div for mobile
        if (jQuery('#qoob-viewport').find('div').length > 0) {
            jQuery('#qoob-viewport').find('div').remove();
        }
    },
    startEditBlock: function (blockId) {
        this.layout.startEditBlock(blockId);
        this.scrollTo(blockId);
    },
    stopEditBlock: function () {
        this.layout.stopEditBlock();
        this.navigate('index', {trigger: true});
    },
    load: function (blocks) {
        this.pageModel.load(blocks);
    },
    setInnerSettingsView: function (view) {
        //Creating storage for views
        this.layout.menu.settingsViewStorage = this.layout.menu.settingsViewStorage || [];
        var name = view.$el.prop('id');
        //Add view to the qoob side
        if (!!this.layout.menu.settingsViewStorage[name]) {
            this.deleteInnerSettingsView(name);
        }
        this.layout.menu.addView(view, 270);
        this.layout.menu.rotate(name);
        this.layout.menu.settingsViewStorage[name] = view;
    },
    deleteInnerSettingsView: function (name) {
        this.layout.menu.delView(name);
        delete this.layout.menu.settingsViewStorage[name];
    },
    deleteBlock: function (model) {
        this.pageModel.deleteBlock(model);
        this.triggerIframe();
    },
    moveDownBlock: function (model) {
        this.pageModel.moveDown(model);
    },
    moveUpBlock: function (model) {
        this.pageModel.moveUp(model);
    },
    triggerIframe: function () {
        this.layout.viewPort.triggerIframe();
    },
    /**
     * Scroll to block
     */
    scrollTo: function (modelId) {
        this.layout.viewPort.scrollTo(modelId);
    }
});
