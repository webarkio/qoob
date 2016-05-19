/**
 * Initialize builder storage
 *
 * @param {Object} options
 * @version 0.0.1
 * @class  BuilderStorage
 */
function BuilderStorage(options) {
    this.pageId = options.pageId || null;
    this.builderTemplates = null;
    this.builderData = null;
    this.pageData = null;
    this.blockSettingsViewData = [];
    this.templates = [];
    this.driver = options.driver || new LocalDriver();
}

/**
 * Load builder templates
 * @param {loadBuilderTemplatesCallback} cb
 */
BuilderStorage.prototype.loadBuilderTemplates = function (cb) {
    if (this.builderTemplates) {
        cb(null, this.builderTemplates);
    } else {
        var self = this;
        self.driver.loadBuilderTemplates(function (err, builderTemplates) {
            if (!err) {
                self.builderTemplates = builderTemplates;
            }
            cb(err, self.builderTemplates);
        });
    }
};
/**
 * Get builder data from storage builderData
 * @param {getBuilderDataCallback} cb - A callback to run.
 */
BuilderStorage.prototype.loadBuilderData = function (cb) {
    if (this.builderData) {
        cb(null, this.builderData);
    } else {
        var self = this;
        self.driver.loadBuilderData(function (err, builderData) {
            if (!err) {
                self.builderData = builderData;
            }
            cb(err, self.builderData);
        });
    }
};

/**
 * Get page data from storage models
 * @param {getPageDataCallback} cb - A callback to run.
 */
BuilderStorage.prototype.loadPageData = function (cb) {
    if (this.pageData) {
        cb(null, this.pageData);
    } else {
        var self = this;
        this.driver.loadPageData(this.pageId, function (err, pageData) {
            if (!err) {
                self.pageData = pageData;
            }
            cb(err, self.pageData);
        });
    }
};

/**
 * 
 * @param {type} templateName
 * @returns {String} BuilderStorage.builderTemplates
 */
BuilderStorage.prototype.getBuilderTemplate = function (templateName) {
    return this.builderTemplates[templateName];
};

BuilderStorage.prototype.getDefaultTemplateAdapter = function () {
    return 'hbs';
};

BuilderStorage.prototype.getBlockConfig = function (templateId) {
    return _.findWhere(this.builderData.items, {id: templateId});
};

/**
 * Get block template by itemId
 * @param {Number} itemId
 * @param {getTemplateCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getBlockTemplate = function (templateId, cb) {
    var self = this;
    //FIXME
    if (this.templates.length > 0 && _.findWhere(this.templates, {
        id: templateId
    })) {
        var item = _.findWhere(this.templates, {
            id: templateId
        });
        cb(null, item.template);
    } else {
        this.driver.loadTemplate(templateId, function (err, template) {
            self.templates.push({
                id: templateId,
                template: template
            });
            cb(null, template);
        });
    }
};

/**
 * Get block config by itemId
 * @param {Number} itemId
 * @param {getConfigCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getConfig = function (itemId, cb) {
    var item = _.findWhere(this.builderData.items, {
        id: itemId
    });
    var config = item.config;
    cb(null, config);
};

/**
 * Save builder
 * @param {Object} json PageData
 * @param {Sring} html DOM blocks
 * @param {saveCallback} cb - A callback to run.
 */
BuilderStorage.prototype.save = function (json, html, cb) {
    var data = {
        data: json,
        html: html
    };

    this.driver.savePageData(this.pageId, data, function (err, state) {
        cb(err, state);
    });
};

/**
 * Getting all assets from storage
 * @returns Array of assets
 */
BuilderStorage.prototype.getAssets = function () {
    var assets = [];
    var self = this;

    if (!!this.builderData) {
        var bd = this.builderData;
        var items = bd.items;
        for (var i = 0, lng = items.length; i < lng; i++) {
            if (!!items[i].assets) {
                assets.push(items[i].assets);
            }
        }
        return assets;
    } else {
        this.driver.loadBuilderData(function (err, builderdata) {
            self.builderData = builderData;
            self.getAssets();
        });
    }
};