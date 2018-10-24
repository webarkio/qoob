/*global LocalDriver*/
/**
 * Initialize qoob storage
 *
 * @param {Object} options
 * @version 0.0.1
 * @class  QoobStorage
 */
function QoobStorage(options) {
    this.loader = options.loader;
    this.driver = options.driver || new LocalDriver();
    this.skinTemplates = options.loader.loaded.skin_templates.data || null;
    this.librariesData = options.librariesData || {};
    this.pageData = options.pageData || null;
    this.blockTemplates = [];
    this.blockTemplateAdapter = options.blockTemplateAdapter || 'hbs';
    this.pageTemplatesCollection = new Backbone.Collection();
    this.assets = [];
    this.imageAssets = [];
    this.videoAssets = [];
    this.icons = [];
    this.translations = options.translations || null;
}

/**
 * Return all groups array or array of specified groups.
 * @param  {Array} libNames Names of needed groups.
 * @return {Array}          Specified groups.
 */
QoobStorage.prototype.getGroups = function(libName) {
    var groups = [];

    _.each(this.librariesData, function(lib) {
        if (libName == null || libName == lib.name) {
            if (undefined !== lib.groups) {
                groups = _.reduce(lib.groups, function(res, group) {
                    var findedGroup = _.findWhere(res, {
                        "id": group.id
                    });
                    if (findedGroup) {
                        findedGroup.position = (parseInt(findedGroup.position) + parseInt(group.position)) / 2;
                        findedGroup.libs.push(lib.name);
                    } else {
                        var resGroup = _.clone(group);
                        resGroup.libs = [lib.name];
                        res.push(resGroup);
                    }
                    return res;
                }, groups);
            }
        }
    });

    return _.sortBy(groups, "position");
};

/**
 *
 * @param  {String} group   Group name for which to find blocks.
 * @param  {Array} libNames Names of needed groups.
 * @return {Array}          Blocks array with blocks of specified group and libs.
 */
QoobStorage.prototype.getBlocksByGroup = function(group, libNames) {
    var result = [],
        data = this.librariesData;

    if (!!libNames) {
        data = data.filter(function(lib) {
            return libNames.indexOf(lib.name) !== -1;
        });
    }

    for (var i = 0; i < data.length; i++) {
        if (undefined !== data[i].blocks) {
            result = result.concat(data[i].blocks.filter(function(block) {
                block.lib = data[i].name;
                return (!!group) ? (!!block.settings && block.groups === group) : (!!block.settings);
            }));
        }
    }

    return result;
};

/**
 *
 * @param {type} templateName
 * @returns {String} QoobStorage.skinTemplates
 */
QoobStorage.prototype.getSkinTemplate = function(templateName) {
    return this.skinTemplates[templateName];
};

QoobStorage.prototype.getDefaultTemplateAdapter = function() {
    return this.blockTemplateAdapter;
};

//FIXME
QoobStorage.prototype.getBlockConfig = function(libName, blockName) {
    var block,
        lib = _.findWhere(this.librariesData, {
            "name": libName
        });
    if (lib != undefined) {
        block = _.findWhere(lib.blocks, {
            "name": blockName
        });
    }
    return block;
};

/**
 * Get template by name
 *
 * @param {String} name Block's name.
 * @param {Function} cb A callback to run.
 */
QoobStorage.prototype.getBlockTemplate = function(libName, blockName, cb) {
    var self = this;
    if (this.blockTemplates[libName + "_" + blockName]) {
        cb(null, this.blockTemplates[libName + "_" + blockName])
    } else {
        var lib = _.findWhere(this.librariesData, {
            "name": libName
        });

        var err = 'blockNotFound';

        if (lib === undefined) {
            cb(err, null);
        } else {
            var block = _.findWhere(lib.blocks, {
                "name": blockName
            });
            if (block === undefined) {
                cb(err, null);
            } else {
                var urlTemplate = block.url + block.template;
                this.loader.add({
                    type: "data",
                    name: "block_" + libName + "_" + blockName,
                    src: urlTemplate,
                    onloaded: function(template) {
                        self.blockTemplates[libName + "_" + blockName] = template;
                        cb(null, template);
                    }
                });
            }
        }
    }
};

/**
 * Save qoob
 * @param {Object} json PageData
 * @param {Sring} html DOM blocks
 * @param {saveCallback} cb - A callback to run.
 */
QoobStorage.prototype.save = function(json, html, cb) {
    var data = {
        data: json,
        html: html,
        libs: this.librariesData
    };
    this.driver.savePageData(data, function(err, state) {
        cb(err, state);
    });
};

/**
 * Translate
 * @param {String} key
 * @param {String} defValue
 */
QoobStorage.prototype.__ = function(key, defValue) {
    if (this.translations !== null &&
        this.translations[key] !== undefined) {
        return this.translations[key];
    } else {
        return defValue;
    }
};

/**
 * Getting all assets from storage
 * @returns Array of assets
 */
QoobStorage.prototype.getAssets = function() {
    var data = this.librariesData;

    if (this.assets.length == 0) {
        var assetsArr = [];
        for (var i = 0; i < data.length; i++) {
            if (undefined !== data[i].blocks) {
                for (var j = 0; j < data[i].blocks.length; j++) {
                    if (undefined !== data[i].blocks[j] && !!data[i].blocks[j].assets) {
                        assetsArr.push(data[i].blocks[j].assets);
                    }
                }
            }

            if (undefined !== data[i].assets) {
                assetsArr.push(data[i].assets);
            }
        }

        this.assets = _.flatten(assetsArr, true);
    }

    return this.assets;
};

/**
 * Getting image assets from storage
 * @returns Array of assets
 */
QoobStorage.prototype.getImageAssets = function() {
    if (this.imageAssets.length == 0) {
        var assets = this.getAssets();

        for (var i = 0; i < assets.length; i++) {
            if (assets[i].type === 'image') {
                this.imageAssets.push({
                    src: assets[i].src,
                    tags: assets[i].tags
                });
            }
        }
    }

    return this.imageAssets;
};

/**
 * Getting video assets from storage
 * @returns Array of assets
 */
QoobStorage.prototype.getVideoAssets = function() {
    if (this.videoAssets.length == 0) {
        var assets = this.getAssets();

        for (var i = 0; i < assets.length; i++) {
            if (assets[i].type === 'video') {
                this.videoAssets.push({
                    src: assets[i].src,
                    pack: assets[i].pack,
                    tags: assets[i].tags,
                    title: assets[i].title ? assets[i].title : '',
                    preview: assets[i].preview
                });
            }
        }
    }

    return this.videoAssets;
};

/**
 * Getting icons from storage
 * @returns Array of icons
 */
QoobStorage.prototype.getIcons = function() {
    if (this.icons.length == 0) {
        var assets = this.getAssets();

        for (var i = 0; i < assets.length; i++) {
            if (assets[i].type === 'icon') {
                this.icons.push({
                    classes: assets[i].classes,
                    tags: assets[i].tags
                });
            }
        }
    }

    return this.icons;
};

/**
 * Getting default templates
 * @returns callback {state} Array of templates
 */
QoobStorage.prototype.loadPageTemplates = function(cb) {
    var self = this;
    this.driver.loadPageTemplates(function(error, data) {
        if (data && data.length > 0) {
            self.pageTemplatesCollection.add(data);
        }
        cb(error);
    });
};

/**
 * Save new template
 * @param template {Array}
 * @returns callback {state}
 */
QoobStorage.prototype.createPageTemplate = function(template, cb) {
    this.pageTemplatesCollection.add(template);

    var pageTemplatesCollection = this.pageTemplatesCollection.filter(function(template) {
        return template.get('external') !== true;
    });

    this.driver.savePageTemplate(pageTemplatesCollection, function(error, state) {
        if (state) {
            cb(error, state);
        }
    });
};

/**
 * Remove template
 * @param id {Number}
 * @returns callback {state}
 */
QoobStorage.prototype.removePageTemplate = function(id) {
    var model = this.pageTemplatesCollection.get(id);

    this.pageTemplatesCollection.remove(model);

    var pageTemplatesCollection = this.pageTemplatesCollection.filter(function(template) {
        return template.get('external') !== true;
    });

    this.driver.savePageTemplate(pageTemplatesCollection, function(error) {
        if (error) {
            console.error(error);
        }
    });
};

/**
 * Get library by url
 * @param {String} url
 * @param {getLibraryByUrlCallback} cb - A callback to run.
 */
QoobStorage.prototype.getLibraryByUrl = function(url, cb) {
    jQuery.ajax({
        dataType: "json",
        url: url,
        error: function(jqXHR, textStatus) {
            cb(textStatus);
        },
        success: function(data) {
            cb(null, data);
        }
    });
}