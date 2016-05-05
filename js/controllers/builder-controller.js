var BuilderController = Backbone.Router.extend({
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
    setAutoSave: function (autosave) {

    },
    save: function () {
        console.log("SAVE");
        var json = JSON.parse(JSON.stringify(this.pageModel.toJSON()));
        var html = '';
        var blocks = this.pageModel.get('blocks').models;
        for (var i = 0; i < blocks.length; i++) {
            var blockModel = blocks[i];
            var blockView = this.storage.getBlockView(blockModel.id); //new BlockView({model:blockModel, storage: this.storage});
            html += blockView.html;
        }
        ;
        this.storage.save(json, html, function (err, status) {
            console.log(arguments);
        });
    },
    exit: function () {
        console.log('EXIT');
        var self = this;
        if (jQuery('.checkbox-sb input').prop("checked")) {
            this.builderLayout.viewPort.save(function (err, state) {
                self.storage.driver.exit(self.storage.pageId);
            });
        } else {
            this.storage.driver.exit(this.storage.pageId);
        }
    },
    addNewBlock: function (templateId, afterId) {
        this.addBlock(BuilderUtils.getDefaultSettings(this.storage.builderData.items, templateId), afterId);
    },
    addBlock: function (values, afterId) {
        var model = BuilderUtils.createModel(values);
        this.pageModel.addBlock(model, afterId);
    },
    startEditBlock: function (blockId) {
        this.layout.startEditBlock(blockId);
    },
    stopEditBlock: function () {
        this.layout.stopEditBlock();
        this.navigate('index', {trigger: true});
    },
    load: function(blocks) {
        this.pageModel.load(blocks);
    }
});
