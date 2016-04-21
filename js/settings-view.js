/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var SettingsView = Backbone.View.extend(
/** @lends SettingsView.prototype */{
    tagName: "div",
    className: "settings menu-block",
    buidler_menu_blocks_settingsTpl : null,
    
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
    initialize: function () {
        this.buidler_menu_blocks_settingsTpl = _.template(builder.storage.getBuilderTemplate('buildermenu-settings'));
    },
    /**
     * Render settings
     * @returns {Object}
     */
    render: function () {
        this.$el.html(this.buidler_menu_blocks_settingsTpl());
        return this;
    }
});