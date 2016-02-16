var SettingsView = Backbone.View.extend(
/** @lends SettingsView.prototype */{
    tagName: "div",
    className: "settings-block",
    /**
     * View settings
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
    },
    /**
     * Render settings
     * @returns {Object}
     */
    render: function () {
        var res = [];
        for (var i = 0; i < this.config.length; i++) {
            var input = new Fields[this.config[i].type]({model: this.model});
            input.config = this.config[i];
            res.push(input.render().el);
        }
        this.$el.html(res);
        return this;
    }
});