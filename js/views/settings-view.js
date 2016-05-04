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
        events:{
            'click .back': 'clickBack'
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
                className: 'settings-block settings-scroll'
            });
            this.$el.html(_.template(this.storage.builderTemplates['buildermenu-settings'])(this.config)).append(settingsBlock.render().el);

            return this;
        },
        clickBack: function(){
            this.controller.stopEditBlock();
        },
        dispose: function() {
            // if (this.$el.css('display') != 'none') {
            //     builder.builderLayout.menu.rotate('catalog-groups');
            // }

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
