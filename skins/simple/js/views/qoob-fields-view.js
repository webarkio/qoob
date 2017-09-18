/*global Fields*/
/**
 * Create view fields for block's settings 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobFieldsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobFieldsView.prototype */
    {
        tagName: "div",
        className: "settings-block-items",
        /**
         * View settings
         * @class SettingsView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.model = options.model;
            this.storage = options.storage;
            this.settings = options.settings;
            this.defaults = options.defaults;
            this.controller = options.controller;
            this.fields = [];
        },
        /**
         * Render settings
         * @returns {Object}
         */
        getHtml: function() {
            var res = [];
            for (var i = 0; i < this.settings.length; i++) {
                if (Fields[this.settings[i].type]) {
                    var field = new Fields[this.settings[i].type]({
                        model: this.model,
                        storage: this.storage,
                        settings: this.settings[i],
                        defaults: this.defaults[this.settings[i].name],
                        controller: this.controller,
                        parent: this
                    });

                    this.fields.push(field);
                    res.push(field.render().el);
                } else {
                    throw new Error("Field " + this.settings[i].type + " not found!");
                }
            }
            return res;
        }
    }
);
