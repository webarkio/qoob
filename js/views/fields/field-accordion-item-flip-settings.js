/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipView = FieldView.extend(
        /** @lends BuilderView.prototype */{
            className: "settings menu-block accordion-item",
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
                'click .backward-accordion': 'backward',
                'click .delete-item-accordion': 'deleteInnerSettings'
            },
            /**
             * View buider
             * @class BuilderView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                FieldView.prototype.initialize.call(this, options);
                this.tpl = _.template(this.storage.builderTemplates['field-accordion-item-flip-view-preview']);
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
                    defaults: this.defaults,
                    storage: this.storage,
                    controller: this.controller
                });

                this.$el.html(this.tpl({id: "settings-block-" + this.parentId, currentId: "settings-block-" + this.model.id}));
                this.$el.find('.settings-blocks').prepend(settingsView.render().$el);
                return this;
            },
            deleteInnerSettings: function () {
                var name = this.$el.prop('id');
                this.backward();
                this.model.trigger('delete_model', this);
                this.controller.deleteInnerSettingsView(name);
                
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

