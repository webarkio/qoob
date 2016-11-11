/**
 * Initialize qoob storage
 *
 * @param {Object} options
 * @version 0.0.1
 * @class  QoobStorage
 */
function QoobStorage(options) {
    this.driver = options.driver || new LocalDriver();
    this.skinTemplates = options.loader.loaded.skin_templates.data || null;
    this.librariesData = options.librariesData || {};
    this.pageData = options.pageData || null;
    this.blockSettingsViewData = [];
    this.blockTemplates = [];
    this.blockTemplateAdapter = options.blockTemplateAdapter || 'hbs';
    //    this.currentLib = 'all';
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
            groups = _.reduce(lib.groups, function(res, group){
                var findedGroup = _.findWhere(res, {"id": group.id});
                if(findedGroup){
                    findedGroup.position=(parseInt(findedGroup.position)+parseInt(group.position))/2;
                    findedGroup.libs.push(lib.name);
                }else{
                    var resGroup=_.clone(group);
                    resGroup.libs=[lib.name];
                    res.push(resGroup);
                }
                return res; 
            }, groups);
        }
    });

    return _.sortBy(groups, "position");
};

QoobStorage.prototype.upload = function(cb) {
	this.driver.upload(cb);
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
        result = result.concat(data[i].blocks.filter(function(block) {
            block.lib = data[i].name;
            return (!!group) ? (!!block.settings && block.groups === group) : (!!block.settings);
        }));
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
        var lib = _.findWhere(this.librariesData, {"name": libName});
        var block  = _.findWhere(lib.blocks, {"name": blockName});
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
    if(this.blockTemplates[libName+"_"+blockName]){
        cb(null, this.blockTemplates[libName+"_"+blockName])
    }else{
        var lib = _.findWhere(this.librariesData, {"name": libName});
        var block  = _.findWhere(lib.blocks, {"name": blockName});
        var urlTemplate = block.url + block.template;
        jQuery.ajax({
            url: urlTemplate,
            type: 'GET',
            cache: false,
            dataType: 'html',
            success: function(template) {
                if (template != '') {
                    self.blockTemplates[libName+"_"+blockName] = template;
                    cb(null, template);
                } else {
                    cb(false);
                }
            }
        });

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
        html: html
    };
    this.driver.savePageData(data, function(err, state) {
        cb(err, state);
    });
};


QoobStorage.prototype.__ = function(title, defValue) {
    return defValue;
};


/**
 * Getting all assets from storage
 * @returns Array of assets
 */
QoobStorage.prototype.getAssets = function (libNames) {
    var assets = [],
        data = this.librariesData;

    if (!!libNames) {
        data = data.filter(function (lib) {
            return libNames.indexOf(lib.name) !== -1;
        });
    }

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].blocks.length; j++) {
            if (!!data[i].blocks[j].assets)
                assets.push(data[i].blocks[j].assets);
        }
    }

    return assets;
};