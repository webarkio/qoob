/**
 * Initialize qoob storage
 *
 * @param {Object} options
 * @version 0.0.1
 * @class  QoobStorage
 */
function QoobStorage(options) {
    this.pageId = options.pageId || null;
    this.qoobTemplates = null;
    this.qoobData = null;
    this.pageData = null;
    this.blockSettingsViewData = [];
    this.templates = [];
    this.driver = options.driver || new LocalDriver();
}

/**
 * Load qoob templates
 * @param {loadQoobTemplatesCallback} cb
 */
QoobStorage.prototype.loadQoobTemplates = function (cb) {
    if (this.qoobTemplates) {
        cb(null, this.qoobTemplates);
    } else {
        var self = this;
        self.driver.loadQoobTemplates(function (err, qoobTemplates) {
            if (!err) {
                self.qoobTemplates = qoobTemplates;
            }
            cb(err, self.qoobTemplates);
        });
    }
};
/**
 * Get qoob data from storage qoobData
 * @param {getQoobDataCallback} cb - A callback to run.
 */
QoobStorage.prototype.loadQoobData = function (cb) {
    if (this.qoobData) {
        cb(null, this.qoobData);
    } else {
        var self = this;
        self.driver.loadQoobData(function (err, qoobData) {
            if (!err) {
                self.qoobData = qoobData;
            }
            cb(err, self.qoobData);
        });
    }
};

/**
 * Get page data from storage models
 * @param {getPageDataCallback} cb - A callback to run.
 */
QoobStorage.prototype.loadPageData = function (cb) {
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
 * @returns {String} QoobStorage.qoobTemplates
 */
QoobStorage.prototype.getQoobTemplate = function (templateName) {
    return this.qoobTemplates[templateName];
};

QoobStorage.prototype.getDefaultTemplateAdapter = function () {
    return 'hbs';
};

QoobStorage.prototype.getBlockConfig = function (templateId) {
    return _.findWhere(this.qoobData.items, {id: templateId});
};

/**
 * Get block template by itemId
 * @param {Number} itemId
 * @param {getTemplateCallback} cb - A callback to run.
 */
QoobStorage.prototype.getBlockTemplate = function (templateId, cb) {
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
QoobStorage.prototype.getConfig = function (itemId, cb) {
    var item = _.findWhere(this.qoobData.items, {
        id: itemId
    });
    var config = item.config;
    cb(null, config);
};

/**
 * Save qoob
 * @param {Object} json PageData
 * @param {Sring} html DOM blocks
 * @param {saveCallback} cb - A callback to run.
 */
QoobStorage.prototype.save = function (json, html, cb) {
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
QoobStorage.prototype.getAssets = function () {
    var assets = [];
    var self = this;

    if (!!this.qoobData) {
        var bd = this.qoobData;
        var items = bd.items;
        for (var i = 0, lng = items.length; i < lng; i++) {
            if (!!items[i].assets) {
                assets.push(items[i].assets);
            }
        }
        return assets;
    } else {
        this.driver.loadQoobData(function (err, qoobData) {
            self.qoobData = qoobData;
            self.getAssets();
        });
    }
};