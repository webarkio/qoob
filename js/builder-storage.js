/**
 * Initialize builder storage
 *
 * @version 0.0.1
 * @class  BuilderStorage
 */
function BuilderStorage(builder) {
    this.builder = builder;
    this.storage = [];
}

/**
 * Add model to storage array
 * @param {Number} id
 * @param {Object} model
 */
BuilderStorage.prototype.addModel = function (id, model, group) {
    if (_.indexOf(_.pluck(this.storage, 'id'), id) == -1) {
        this.storage.push({id: id, model: model, group: group});
    }
};

/**
 * Add block view to storage array
 * @param {Number} id
 * @param {Object} bv
 */
BuilderStorage.prototype.addBlockView = function (id, bv) {
    if (_.indexOf(_.pluck(this.storage, 'id'), id) != -1) {
        var item = _.findWhere(this.storage, {id: id});
        item.block_view = bv;
    }
};

/**
 * Add settings view to storage array
 * @param {Number} id
 * @param {Object} sv
 */
BuilderStorage.prototype.addSettingsView = function (id, sv) {
    if (_.indexOf(_.pluck(this.storage, 'id'), id) != -1) {
        var item = _.findWhere(this.storage, {id: id});
        item.setting_view = sv;
    }
};

/**
 * Add settings view to storage array
 * @param {Number} id
 */
BuilderStorage.prototype.remove = function (id) {
    this.storage = _.without(this.storage, _.findWhere(this.storage, {id: id}));
};

/**
 * Get page html from storage
 * @return {String} Html blocks
 */
BuilderStorage.prototype.getPageHtml = function () {
    var self = this, blocks = [],
            iframe = this.builder.iframe.getWindowIframe(),
            elements = iframe.jQuery('#builder-blocks').find('[data-model-id]');

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

/**
 * Get page data
 * @return {Array} data
 */
BuilderStorage.prototype.getPageData = function (err, cb) {

//    cb(err, data);
//    this.storage;
};