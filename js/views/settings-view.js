/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuSettingsView = Backbone.View.extend(
/** @lends BuilderMenuSettingsView.prototype */{
    tagName: "div",
    className: "settings",
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
     * @class BuilderMenuSettingsView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
        this.config = data.config;
        var self = this;
        builder.storage.getBuilderTemplate('buildermenu-settings', function(err, data){
            self.buidlerMenuBlocksSettingsTpl = _.template(data);
        });
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
        
        // add SettingsView to storage
        builder.storage.addSettingsView(this);
        
        return this;
    },
    dispose: function () {
        if (this.$el.css('display') != 'none') {
            builder.builderLayout.menu.rotate('catalog-groups');
        }        
        
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