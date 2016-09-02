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
    this.currentLib = 'all';
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
 * Unmask urls of blocks and gather block's data by these urls. Then join these data into one array and put it into storage.
 * @param  {Array}   libsJson Array of lib.json files, previously gatherd.
 * @param  {Function} cb  Callback function.
 */
QoobStorage.prototype.joinLibs = function (libsJson, cb) {
    var self = this,
        req=[],
        res=[];
    
    for (var i = 0; i < libsJson.length; i++) {
        for (var j = 0; j < libsJson[i].blocks.length; j++) {
        var proxy={
            i:i,
            j:j,
            callback: function(data){
                data.url = libsJson[this.i].blocks[this.j].url;
                var block_data = QoobStorage.parseBlockConfigMask(data, libsJson[this.i].blocks);
                block_data.name = libsJson[this.i].blocks[this.j].name;
                libsJson[this.i].blocks[this.j] = block_data;
            }
        };
        req.push(jQuery.getJSON(libsJson[i].blocks[j].url + 'config.json'));
        res.push(proxy);
        }
    }

    jQuery.when.apply(jQuery, req).done(function(){
        var args = Array.prototype.slice.call(arguments);
        for (var i = 0; i < args.length; i++) {
            res[i].callback.apply(res[i], args[i]);
        }
        self.qoobData = libsJson;
        cb(null, libsJson);
    }).fail(function(){
        console.log('Fail');
        //FIXME message
    });
};

/**
 * Parsing config file of specified block and replacing masks
 * @param  {Object} block  Block object to parse
 * @param  {Array} blocks Array of all blocks
 * @return {Object}        Parsed block config
 */
QoobStorage.parseBlockConfigMask = function (block, blocks) {
    block = JSON.stringify(block).replace(/%theme_url%|%block_url%|%block_url\([^\)]+\)%/g, function(substr) {
        var mask = '';
        switch(substr) {
            case '%theme_url%': mask = ajax.theme_url;
                break;
            case '%block_url%': mask = block.url;
                break;
            default:
                var blockName = substr.replace(/%block_url\(|\)%/g, '');
                if (mask = _.findWhere(blocks, {name: blockName}))
                    mask = mask.url;
                break;
        }

        return mask;
    });

    return JSON.parse(block);
};

/**
 * Return all groups array or array of specified groups.
 * @param  {Array} libNames Names of needed groups.
 * @return {Array}          Specified groups.
 */
QoobStorage.prototype.getGroups = function (libNames) {
    var result = [],
        data = this.qoobData;

    if (!!libNames) {
        data = data.filter(function (lib) {
            return libNames.indexOf(lib.name) !== -1;
        });
    }

    for (var i = 0; i < data.length; i++) {
        data[i].groups.map(function(group) {
            var index = _.findIndex(result, {id: group.id}); 
            if(index === -1) {
                group.libs = [data[i].name];
                result.push(group);
            } else {
                result[index].libs.push();
            }
        });
    }

    return result;
};

/**
 * 
 * @param  {String} group   Group name for which to find blocks.
 * @param  {Array} libNames Names of needed groups.
 * @return {Array}          Blocks array with blocks of specified group and libs.
 */
QoobStorage.prototype.getBlocksByGroup = function (group, libNames) {
    var result = [],
        data = this.qoobData;

    if (!!libNames) {
        data = data.filter(function (lib) {
            return libNames.indexOf(lib.name) !== -1;
        });
    }

    for (var i = 0; i < data.length; i++) {
        result = result.concat(data[i].blocks.filter(function(block) {
            block.lib = data[i].name;
            return (!!group) ? (!!block.settings && block.groups === group) : (!!block.settings);
        }));
    } 
    
    return result;
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
    return _.findWhere(this.getBlocksByGroup(), {name: templateId});
};

/**
 * Get template by name
 * 
 * @param {String} name Block's name.
 * @param {Function} cb A callback to run.
 */
QoobStorage.prototype.loadTemplate = function(name, cb) {
    var curBlock = _.findWhere(this.getBlocksByGroup(), {name: name}),
        urlTemplate = curBlock.url + curBlock.template;

    jQuery(document).ready(function($) {
        if (ajax.logged_in && ajax.qoob == true) {
            $.ajax({
                url: urlTemplate,
                type: 'GET',
                cache: false,
                dataType: 'html',
                success: function(template) {
                    if (template != '') {
                        cb(null, template);
                    } else {
                        cb(false);
                    }
                }
            });
        }
    });
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
        this.loadTemplate(templateId, function (err, template) {
            self.templates.push({
                id: templateId,
                template: template
            });
            cb(null, template);
        });
    }
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

    if (!!this.qoobData) {
        for (var i = 0, items = this.getBlocksByGroup(), lng = items.length; i < lng; i++) {
            if (!!items[i].assets) {
                assets.push(items[i].assets);
            }
        }
    }

    return assets;
};