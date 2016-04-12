/**
 * Initialize page builder
 *
 * @version 0.0.1
 * @class  Builder
 * @param {Object} options [current page id and {Object} data]
 */
//module.exports.Builder = Builder;
function Builder(storage) {
    this.loader = new BuilderLoader(this);
    this.toolbar = new BuilderToolbar(this);
    this.viewPort = new BuilderViewPort(this);
    this.menu = new BuilderMenu(this);
    this.iframe = new BuilderIframe(this);
    this.storage = storage;
    this.pageData = [];
    this.builderSettingsData = null;
    this.modelCounter = 0;
}

/*
 * Getting driver page id for iframe
 * @param integer pageId id of the page
 * @returns string URL
 */
Builder.prototype.getIframePageUrl = function (pageId) {
    return this.driver.getIframePageUrl(pageId);
};

/**
 * @callback loadBuilderDataCallback
 */

/**
 * Get builder data
 *
 * @param {loadBuilderDataCallback} cb - A callback to run.
 */
//Builder.prototype.loadBuilderData = function (cb) {
//    this.driver.loadBuilderData(cb);
//
//};

/**
 * @callback callIframeCallback
 */

/**
 * Get is callback state iframe when loading
 *
 * @param {callIframeCallback} cb - A callback to run.
 */
Builder.prototype.callIframe = function (cb) {
    jQuery('iframe#builder-iframe').load(function () {
        cb(this);
    });
};

/**
 * @callback loadPageDataCallback
 */

/**
 * Get page data
 *
 * @param {loadPageDataCallback} cb - A callback to run.
 */
Builder.prototype.loadPageData = function (cb) {
    this.driver.loadPageData(this.pageId, cb);
};

/**
 * Out of the Builder
 */
Builder.prototype.exit = function () {
    this.driver.exit(this.pageId);
};

/**
 * Autosave page data for interval
 */
Builder.prototype.autosavePageData = function () {
    var self = this;
    if (jQuery('.checkbox-sb input').prop("checked")) {
        var intervalId = setInterval(function () {
            if (!jQuery('.checkbox-sb input').prop("checked")) {
                clearInterval(intervalId);
            } else {
                self.save();
            }
        }, 60000);
    }
};

/**
 * @callback getTemplateCallback
 */

/**
 * Get template by id
 *
 * @param {integer} templateId
 * @param {getTemplateCallback} cb - A callback to run.
 */
//Builder.prototype.getTemplate = function (templateId, cb) {
//    this.driver.loadTemplate(templateId, cb);
//};

/**
 * DEPRECATED
 * 
 * Get settings by id
 *
 * @param {integer} templateId
 * @param {getSettingsCallback} cb - A callback to run.
 */
Builder.prototype.getSettings = function (templateId, cb) {
    this.driver.loadSettings(templateId, cb);
};

/**
 * Make layout size
 */
Builder.prototype.makeLayoutSize = function () {
    this.toolbar.resize();
    this.menu.resize();
    this.viewPort.resize();
    this.iframe.resize();
};

/**
 * Show settings current block
 *
 * @param {integer} blockId
 */
Builder.prototype.editBlock = function (blockId) {
    this.menu.showSettings(blockId);
};

/**
 * Create Backbone.Model for settings
 *
 * @param {Object} settings
 * @returns {Backbone.Model|Builder.prototype.createModel.model}
 */
Builder.prototype.createModel = function (settings) {
    settings.id = ++this.modelCounter;
    var model = new Backbone.Model();

    var newSettings = {};

    for (var i in settings) {
        if (_.isArray(settings[i])) {
            newSettings[i] = this.createCollection(settings[i]);
            model.listenTo(newSettings[i], "change", function () {
                this.trigger('change', this);
            });
        } else {
            newSettings[i] = settings[i];
        }
        model.set(i, newSettings[i]);
    }

    return model;
};

/**
 * Create collection when nested field is array
 *
 * @param {Object} settings
 * @returns {Builder.prototype.createCollection.collection|Backbone.Collection}
 */
Builder.prototype.createCollection = function (settings) {
    var collection = new Backbone.Collection();

    for (var i = 0; i < settings.length; i++) {
        var model = this.createModel(settings[i]);
        collection.add(model);
        collection.listenTo(model, 'change', function () {
            this.trigger('change', this);
        });
    }
    return collection;
};

/**
 * Get default settings
 *
 * @param {integer} templateId
 * @param {getDefaultSettingsCallback} cb - A callback to run.
 */
Builder.prototype.getDefaultConfig = function (templateId, cb) {
    this.storage.getConfig(templateId, function (err, data) {
        var config = {};
        for (var i = 0; i < data.length; i++) {
            config[data[i].name] = data[i].default;
        }
        config.template = templateId;
        cb(null, config);
    });
};

/**
 * Activate page builder
 */
Builder.prototype.activate = function () {
    var self = this;
    self.loader.add(4);
    self.loader.sub();
    self.makeLayoutSize();
    self.loader.sub();
    jQuery(window).resize(function () {
        self.makeLayoutSize();
    });

    self.callIframe(function () {
        self.storage.getBuilderData(function (err, builderData) {
            self.menu.create();
            self.loader.sub();

            // Autosave
            self.autosavePageData();

            self.storage.getPageData(function (err, pageData) {
                if (pageData.length > 0) {
                    self.loader.add(pageData.length);
                }

                self.viewPort.create(pageData);
                self.loader.sub();
            });
        });
    });
};

