/**
 * Create view fields for block's settings 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobFieldsView = Backbone.View.extend(
/** @lends QoobFieldsView.prototype */{
    tagName: "div",
    className: "settings-block",
    /**
     * View settings
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.storage = options.storage;
        this.settings = options.settings;
        this.defaults = options.defaults;
        this.controller = options.controller;
        this.parentId = options.parentId;
    },
    /**
     * Render settings
     * @returns {Object}
     */
    render: function () {
        var res = [];
        for (var i = 0; i < this.settings.length; i++) {
            if (Fields[this.settings[i].type]) {
                var input = new Fields[this.settings[i].type]({
                    model: this.model,
                    storage: this.storage,
                    settings: this.settings[i],
                    defaults: this.defaults[this.settings[i].name],
                    controller: this.controller,
                    parentId: this.parentId
                });
                res.push(input.render().el);
            } else {
                throw new Error("Field " + this.settings[i].type + " not found!");
            }
        }
        this.$el.html(res);
        
        return this;
    }
});