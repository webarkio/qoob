/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipView = Backbone.View.extend(
        /** @lends BuilderView.prototype */{
            tagName: "div",
            className: "settings menu-block",
            tpl: null,
            parentId: null,
            /**
             * Set setting's id
             * @class SettingsView
             * @augments Backbone.View
             * @constructs
             */
            attributes: function () {
                return {
                    id: "settings-block-" + this.model.id
                };
            },
            events: {
                'click .backward-accordion': 'backward'
            },
            /**
             * View buider
             * @class BuilderView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                this.model = options.model;
                this.storage = options.storage;
                this.settings = options.settings;
                this.controller = options.controller;
                this.tpl = _.template(this.storage.builderTemplates['field-accordion-item-flip-view']);
                this.parentId = options.parentId;
            },
            /**
             * Render builder view
             * @returns {Object}
             */
            render: function () {
                var settingsView = new FieldsView({
                    model: this.model,
                    settings: this.settings,
                    storage: this.storage,
                    controller: this.controller
                });
                this.$el.html(this.tpl({id: "settings-block-" + this.parentId, currentId: "settings-block-" + this.model.id}));
                this.$el.append(settingsView.render().el);
                return this;
            },
            /**
             * Remove view
             */
            dispose: function () {
                // same as this.$el.remove();
                this.$el.remove();
                // unbind events that are
                // set on this view
                this.off();
                // remove all models bindings
                // made by this view
                this.model.off(null, null, this);
            },
            backward: function () {
                this.controller.layout.menu.rotate("settings-block-" + this.parentId);
            }
        });

