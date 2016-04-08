/**
 * Initialize builder storage
 * 
 * @param {Object} options
 * @version 0.0.1
 * @class  BuilderStorage
 */

function BuilderStorage(options) {
    console.log(options.pageId);
    this.pageId = options.pageId || null;
    this.builderData = null;
    this.models = [];
    this.blockViewData = [];
    this.blockSettingsViewData = [];
    this.templates = [];
    this.driver = options.driver || new LocalDriver();
}

/**
 * Add model to storage models array
 * @param {Object} model
 */
BuilderStorage.prototype.addModel = function (model) {
    this.models.push(model);
};

/**
 * Add block view to storage blockViewData array
 * @param {Object} bv
 */
BuilderStorage.prototype.addBlockView = function (bv) {
    this.blockViewData.push(bv);
};

/**
 * Add settings view to blockSettingsViewData array
 * @param {Object} sv
 */
BuilderStorage.prototype.addSettingsView = function (sv) {
    this.blockSettingsViewData.push(sv);
};

/**
 * Remove model by id
 * @param {Number} id modelId
 */
BuilderStorage.prototype.delModel = function (id) {
    this.models = _.without(this.models, _.findWhere(this.models, {id: id}));
};

/**
 * Remove BlockView by id
 * @param {Number} id modelId
 */
BuilderStorage.prototype.delBlockView = function (id) {
    this.blockViewData = _.without(this.blockViewData, _.findWhere(this.blockViewData, {id: id}));
};

/**
 * Remove SettingsView by id
 * @param {Number} id modelId
 */
BuilderStorage.prototype.delSettingsView = function (id) {
    this.blockSettingsViewData = _.without(this.blockSettingsViewData, _.findWhere(this.blockSettingsViewData, {id: id}));
};

/**
 * Get model by id
 * @param {Number} id modelId
 */
BuilderStorage.prototype.getModel = function (id) {
    return _.findWhere(this.models, {id: id});
};

/**
 * Get BlockView by id
 * @param {Number} id modelId
 */
BuilderStorage.prototype.getBlockView = function (id) {
    return _.findWhere(this.blockViewData, {id: id});
};

/**
 * Get SettingsView by id
 * @param {Number} id modelId
 */
BuilderStorage.prototype.getSettingsView = function (id) {
    return _.findWhere(this.blockSettingsViewData, {id: id});
};

/**
 * Get builder data from storage builderData
 * @param {getBuilderDataCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getBuilderData = function (cb) {
    var self = this;
    if (this.builderData.length > 0) {
        cb(null, this.builderData);
    } else {
        this.driver.loadBuilderData(function (err, builderData) {
            self.builderData = builderData;
            cb(err, self.builderData);
        });
    }
};

/**
 * Get page data from storage models
 * @param {getPageDataCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getPageData = function (cb) {
    var self = this;
    if (this.models.length > 0) {
        cb(null, this.models);
    } else {
        this.driver.loadPageData(this.pageId, function (err, pageData) {
            self.models = pageData;
            cb(err, self.models);
        });
    }
};

/**
 * Get block template by itemId
 * @param {Number} itemId
 * @param {getTemplateCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getTemplate = function (itemId, cb) {
    var self = this;
    if (this.templates.length > 0 && _.findWhere(this.templates, {id: itemId})) {
        var tpl = _.findWhere(this.templates, {id: itemId});
        cb(null, tpl);
    } else {
        this.driver.loadTemplate(itemId, function (err, template) {
            self.templates.push({id: itemId, template: template});
            cb(err, template);
        });
    }
};

/**
 * Get block config by itemId
 * @param {Number} itemId
 * @param {getConfigCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getConfig = function (itemId, cb) {
    var config = this.builderData;
    
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
 * Get page html from storage
 * @return {String} Html blocks
 */
BuilderStorage.prototype.getPageHtml = function () {
    var self = this, blocks = [];
//            iframe = this.builder.iframe.getWindowIframe(),
//            elements = iframe.jQuery('#builder-blocks').find('[data-model-id]');

    if (elements.length > 0) {
        var i = 0;
        elements.each(function (i, v) {
            _.each(self.storage, function (item) {
                if (jQuery(v).data('model-id') == item.model.id) {
                    blocks.push(jQuery(item.block_view.render().el).html());
                    item.model.set('position', i);
                    i++;
                }
            });
        });
    }

    return blocks.join('');
};

/**
 * Get page JSON from storage
 * @return {String} JSON blocks
 */
BuilderStorage.prototype.getPageJSON = function () {
    var blocks_json = {};

    // group by
    var groups = _.chain(this.storage)
            .groupBy(function (obj) {
                return obj['group'];
            })
            .value();

    // remove all except model
    _.each(groups, function (v, k) {
        if (k == 'global_settings') {
            blocks_json[k] = _.first(_.pluck(v, 'model'));
        } else {
            blocks_json[k] = _.pluck(v, 'model');

            blocks_json[k] = _.sortBy(blocks_json[k], function (model) {
                return model.get('position');
            });
        }
    });

    return JSON.parse(JSON.stringify(blocks_json));
};