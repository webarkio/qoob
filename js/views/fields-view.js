/**
 * Create view fields for block's settings 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var FieldsView = Backbone.View.extend(
/** @lends FieldsView.prototype */{
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
    },
    /**
     * Render settings
     * @returns {Object}
     */
    render: function () {
        var res = [];
        for (var i = 0; i < this.settings.length; i++) {
            var input = new Fields[this.settings[i].type]({model: this.model, storage: this.storage, settings: this.settings[i]});
            res.push(input.render().el);
        }
        this.$el.html(res);
        
        return this;
    }
});