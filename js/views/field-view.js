/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var FieldView = Backbone.View.extend({
    className: "settings-item",
    initialize: function (options) {
        this.model = options.model;
        this.storage = options.storage;
        this.settings = options.settings;
        this.defaults = options.defaults;
        this.controller = options.controller;
    },
    /**
     * Get value field text
     * @returns {String}
     */
    getValue: function () {
        if (!this.model.get(this.settings.name)) {
            var defaultVal = _.isArray(this.defaults) ? BuilderUtils.createCollection(this.defaults) : this.defaults;
            this.model.set(this.settings.name, defaultVal);
        }
        return this.model.get(this.settings.name);
    }
});



