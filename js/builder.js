/**
 * Initialize page builder
 *
 * @version 0.0.1
 * @class  Builder
 * @param {Object} options [current page id and {Object} data]
 */
//module.exports.Builder = Builder;
function Builder(options) {
    this.loader = new BuilderLoader(this);
    this.driver = options.driver || new LocalDriver();
    this.toolbar = new BuilderToolbar(this);
    this.viewPort = new BuilderViewPort(this);
    this.menu = new BuilderMenu(this);
    this.pageId = options.pageId || null;
    this.iframe = new BuilderIframe(this);
    this.pageData = [];
    this.builderData = null;
    this.builderSettingsData = null;
    this.modelCounter = 0;
}
/**
 * Create html page builder
 * @returns {DOMElement}
 */
Builder.prototype.create = function () {
    var el = '<div id="builder">' +
            '<div id="builder-toolbar">' +
            '<div class="logo">' +
            '<div class="wrap-cube">' +
            '<div class="cube">' +
            '<div class="front"></div>' +
            '<div class="back"></div>' +
            '<div class="top"></div>' +
            '<div class="bottom"></div>' +
            '<div class="left"></div>' +
            '<div class="right"></div>' +
            '</div>' +
            '</div>' +
            '<div class="text"></div></div>' +
            '<div class="edit-control-bar">' +
            '<div class="autosave">' +
            '<label class="checkbox-sb">' +
            '<input type="checkbox"  onclick="parent.builder.autosavePageData();" checked="checked"><span></span><em>Autosave</em>' +
            '</label>' +
            '</div>' +
            '<div class="edit-control-button">' +
            '<button class="save" type="button" onclick="parent.builder.save(); return false;"><span>Save</span>' +
            '<div class="clock">' +
            '<div class="minutes-container"><div class="minutes"></div></div>' +
            '<div class="seconds-container"><div class="seconds"></div></div>' +
            '</div>' +
            '</button>' +
            '<button class="exit-btn" onclick="builder.exit(); return false;" type="button">Exit</button>' +
            '<button class="screen-size settings" type="button" onclick="builder.menu.showGlobalSettings();return false;"></button>' +
            '<button class="screen-size pc active" onclick="parent.builder.toolbar.screenSize(this); return false;" type="button"></button>' +
            '<button class="screen-size tablet-vertical" onclick="parent.builder.toolbar.screenSize(this); return false;" type="button"></button>' +
            '<button class="screen-size phone-vertical" onclick="parent.builder.toolbar.screenSize(this); return false;" type="button"></button>' +
            '<button class="screen-size tablet-horizontal" onclick="parent.builder.toolbar.screenSize(this); return false;" type="button"></button>' +
            '<button class="screen-size phone-horizontal" onclick="parent.builder.toolbar.screenSize(this); return false;" type="button"></button>' +
            '<button class="arrow-btn hide-builder" onclick="parent.builder.toolbar.hideBuilder(this); return false;" type="button"></button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="builder-menu">' +
            '<div id="card">' +
            '<div class="card-wrap">' +
            '<div class="card-main">' +
            '<div class="blocks-settings"></div>' +
            '<div class="groups">' +
            '</div>' +
            '<div class="list-group"></div>' +
            '<div class="global-settings"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div id="builder-content"><div id="builder-viewport" class="pc">' +
            '<iframe src="' + this.getIframePageUrl(this.pageId) + '" scrolling="auto" name="builder-iframe" id="builder-iframe"></iframe>' +
            '</div></div>' +
            '</div>';
    jQuery('body').prepend(el);
};

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
Builder.prototype.loadBuilderData = function (cb) {
    this.driver.loadBuilderData(cb);

};

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
 * Save page data
 */
Builder.prototype.save = function () {
    var self = this;
    this.loader.showAutosave();

    var data = this.iframe.getIframePageData();

    this.driver.savePageData(this.pageId, data, function () {
        self.loader.hideAutosave();
    });
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
Builder.prototype.getTemplate = function (templateId, cb) {
    this.driver.loadTemplate(templateId, cb);
};

/**
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
Builder.prototype.getDefaultSettings = function (templateId, cb) {
    this.getSettings(templateId, function (err, data) {
        var settings = {};
        for (var i = 0; i < data.length; i++) {
            settings[data[i].name] = data[i].default;
        }
        settings.template = templateId;
        cb(null, settings);
    });
};

/**
 * Activate page builder
 */
Builder.prototype.activate = function () {

    var self = this;
    self.loader.add(4);
    self.create();
    self.loader.sub();
    self.makeLayoutSize();
    self.loader.sub();
    jQuery(window).resize(function () {
        self.makeLayoutSize();
    });

    self.callIframe(function () {
        self.loadBuilderData(function (err, builderData) {
            self.builderData = builderData;
            self.menu.create();
            self.loader.sub();

            // Autosave
            self.autosavePageData();

            self.loadPageData(function (err, pageData) {
                if (pageData && pageData.blocks) {
                    self.loader.add(pageData.blocks.length);
                }

                self.viewPort.create(pageData);
                self.menu.createGlobalControl(pageData);
                self.loader.sub();
            });
        });
    });
};

