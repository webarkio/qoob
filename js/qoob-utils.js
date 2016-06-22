/**
 * Utils for qoob
 *
 * @version 0.0.1
 * @class  QoobUtils
 */
var QoobUtils = {
    /**
     * Find items for params
     * @param {Array} data
     * @param {Object} args filter params
     * @returns {Object}
     */
    findItems: function(data, args) {
        var result;
        return result;
    },
    /**
     * Create Backbone.Model for settings
     *
     * @param {Object} settings
     * @returns {Backbone.Model|QoobUtils.prototype.createModel.model}
     */
    createModel: function(settings) {
        settings.id = parseInt(_.uniqueId());
        var model = new BlockModel();

        var newSettings = {};
        for (var i in settings) {
            if (_.isArray(settings[i])) {
                newSettings[i] = this.createCollection(settings[i]);
                model.listenTo(newSettings[i], "change", function() {
                    this.trigger('change', this);
                });

                newSettings[i].forEach(function(model, index) {
                    model.owner_id = settings.id;
                });
            } else {
                newSettings[i] = settings[i];
            }
            model.set(i, newSettings[i]);
        }

        return model;
    },
    /**
     * Create collection when nested field is array
     *
     * @param {Object} settings
     * @returns {QoobUtils.prototype.createCollection.collection|Backbone.Collection}
     */
    createCollection: function(settings) {
        var collection = new Backbone.Collection();

        for (var i = 0; i < settings.length; i++) {
            var model = this.createModel(settings[i]);
            collection.add(model);
            collection.listenTo(model, 'change', function() {
                this.trigger('change', this);
            });
        }
        return collection;
    },
    /**
     * Get default settings
     *
     * @param {integer} templateId
     */
    getDefaultSettings: function(items, templateId) {
        // get config from storage qoobData
        //qoob.storage.qoobData.items
        var values = {};
        var settings = _.findWhere(items, { id: templateId }).settings;
        var defaults = (_.findWhere(items, { id: templateId }).defaults);
        for (var i = 0; i < settings.length; i++) {
            values[settings[i].name] = defaults[settings[i].name];
        }
        values.template = templateId;

        return values;
    },
    /**
     * Encode JSON request string. Equal to jQuery.param method, but including empty arrays too.
     *
     * @param {string} a Request string
     */
    JSONParam: function(a) {
        var s = [],
            rbracket = /\[\]$/,
            isArray = function(obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            },
            add = function(k, v) {
                v = typeof v === 'function' ? v() : v === null ? '' : v === undefined ? '' : v;
                s[s.length] = encodeURIComponent(k) + '=' + encodeURIComponent(v);
            },
            buildParams = function(prefix, obj) {
                var i, len, key;

                if (prefix) {
                    if (isArray(obj)) {
                        if (obj.length === 0) {
                            s[s.length] = encodeURIComponent(prefix) + '=[]';
                        } else {
                            for (i = 0, len = obj.length; i < len; i++) {
                                if (rbracket.test(prefix)) {
                                    add(prefix, obj[i]);
                                } else {
                                    buildParams(prefix + '[' + (typeof obj[i] === 'object' ? i : '') + ']', obj[i]);
                                }
                            }
                        }
                    } else if (obj && String(obj) === '[object Object]') {
                        for (key in obj) {
                            buildParams(prefix + '[' + key + ']', obj[key]);
                        }
                    } else {
                        add(prefix, obj);
                    }
                } else if (isArray(obj)) {
                    for (i = 0, len = obj.length; i < len; i++) {
                        add(obj[i].name, obj[i].value);
                    }
                } else {
                    for (key in obj) {
                        buildParams(key, obj[key]);
                    }
                }
                return s;
            };

        return buildParams('', a).join('&').replace(/%20/g, '+');
    }
};
