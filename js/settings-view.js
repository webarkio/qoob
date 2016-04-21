/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var SettingsView = Backbone.View.extend(
/** @lends SettingsView.prototype */{
    tagName: "div",
    className: "settings menu-block",
    buidlerMenuBlocksSettingsTpl : null,
    config : null,
    
    /**
     * Set setting's id
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    attributes : function () {
        return {
            id : "settings-block-" + this.model.id
        };
    },

    /**
     * View settings
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
        this.config = data.config;
        this.buidlerMenuBlocksSettingsTpl = _.template(builder.storage.getBuilderTemplate('buildermenu-settings'));
        this.render();
    },
    /**
     * Render settings
     * @returns {Object}
     */
    render: function () {
        var settingsBlock = new FieldsView({
            model: this.model,
            className: 'settings-block settings-scroll'
        });

        settingsBlock.config = this.config;

        this.$el.html(this.buidlerMenuBlocksSettingsTpl()).append(settingsBlock.render().el);
        return this;
    }
});