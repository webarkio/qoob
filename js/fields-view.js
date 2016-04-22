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
        
        // add SettingsView to storage
        builder.storage.addSettingsView(this);
        
        return this;
    },
    dispose: function () {
        // same as this.$el.remove();
        this.remove();

        // unbind events that are
        // set on this view
        this.off();

        // remove all models bindings
        // made by this view
        this.model.off(null, null, this);
    }
});