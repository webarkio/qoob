/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuSettingsView = Backbone.View.extend(
    /** @lends BuilderMenuSettingsView.prototype */
    {
        tagName: "div",
        className: "settings menu-block",
        config: null,
        events: {
            'click .back': 'clickBack',
            'click .delete-block': 'clickDelete'

        },
        /**
         * Set setting's id
         * @class SettingsView
         * @augments Backbone.View
         * @constructs
         */
        attributes: function() {
            return {
                id: "settings-block-" + this.model.id
            };
        },
        /**
         * View settings
         * @class BuilderMenuSettingsView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            var self = this;
            this.config = options.config;
            this.storage = options.storage;
            this.controller = options.controller;
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {

            var settingsBlock = new FieldsView({
                model: this.model,
                storage: this.storage,
                settings: this.config.settings,
                defaults: this.config.defaults,
                controller: this.controller,
                className: 'settings-block'
            });
            this.$el.html(_.template(this.storage.builderTemplates['menu-settings-preview'])(this.config)).find('.settings-blocks').prepend(settingsBlock.render().el);


            // add devices field from all settings
            var devices = new Fields['devices']({model: this.model, storage: this.storage, controller: this.controller});
            this.$el.find('.settings-block').append(devices.render().el);
            
            return this;
        },
        clickBack: function(){
            this.controller.stopEditBlock();
        },
        clickDelete: function() {
            this.controller.deleteBlock(this.model);
        },
        dispose: function() {
            // same as this.$el.remove();
            this.$el.remove();

            // unbind events that are
            // set on this view
            this.off();

            // remove all models bindings
            // made by this view
            this.model.off(null, null, this);
        }
    });
