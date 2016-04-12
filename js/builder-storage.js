/**
 * Initialize builder storage
 *
 * @param {Object} options
 * @version 0.0.1
 * @class  BuilderStorage
 */

function BuilderStorage(options) {
    this.pageId = options.pageId || null;
    this.builderData = null;
    this.models = [];
    this.blockViewData = [];
    this.blockSettingsViewData = [];
    this.templates = [];
    this.fieldsTemplate = {};
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
    if (this.blockViewData.indexOf(bv) == -1) {
        this.blockViewData.push(bv);
    } else {
        this.blockViewData[this.blockViewData.indexOf(bv)] = bv;
    }
};

/**
 * Add settings view to blockSettingsViewData array
 * @param {Object} sv
 */
BuilderStorage.prototype.addSettingsView = function (sv) {
    if (this.blockSettingsViewData.indexOf(sv) == -1) {
        this.blockSettingsViewData.push(sv);
    } else {
        this.blockSettingsViewData[this.blockSettingsViewData.indexOf(sv)] = sv;
    }
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
    if (undefined != this.builderData && this.builderData.length > 0) {
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
            if (pageData) {
                for (var i = 0; i < pageData.length; i++) {
                    self.models.push(this.builder.createModel(pageData[i]));
                }
            }

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
        var item = _.findWhere(this.templates, {id: itemId});
        cb(null, item.template);
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
    var item = _.findWhere(this.builderData.items, {id: itemId});
    var config = item.config.settings;
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
 * Get builder data from storage builderData
 * @param {getBuilderDataCallback} cb - A callback to run.
 */
BuilderStorage.prototype.getFieldsTemplate = function (cb) {
   
    console.log("here"); 
    // if (this.fieldsTemplate.length > 0 && _.findWhere(this.fieldsTemplate, {id: itemId})) {
    //     var item = _.findWhere(this.fieldsTemplate, {id: itemId});
    //     cb(null, item.template);
    // } else {
        this.driver.loadFieldsTmpl(function (err, templates) {
            this.fieldsTemplate = templates;
            // for (var i = 0; i < templates.length; i++) {
            //       self.fieldsTemplate.push(templates[i]);
            //      // console.log(self.fieldsTemplate);
            //      // this.fieldsTemplate = templates[i];
            //      //this.fieldsTemplate = templates[i];
            // }
            // console.log(self.fieldsTemplate);
            // self.fieldsTemplate.push({id: itemId, template: template});
            // cb(err, template);
            console.log(this);
            console.log(this.fieldsTemplate["field-text"]);
        }.bind(this));
    // }
    
};