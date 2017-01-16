/**
 * Create accordion item flip view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipView = QoobFieldView.extend(
        /** @lends AccordionFlipView.prototype */{
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
                    id: "settings-block-" + this.model.id,
                    'data-side-id': this.model.id
                };
            },
            events: {
                'click .backward-accordion': 'backward',
                'click .delete-item-accordion': 'deleteInnerSettings'
            },
            /**
             * View accordion item flip
             * @class AccordionFlipView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                QoobFieldView.prototype.initialize.call(this, options);
                this.tpl = _.template(this.storage.getSkinTemplate('field-accordion-item-flip-view-preview'));
                this.parentId = options.parentId;
            },
            /**
             * Render accordion item flip view
             * @returns {Object}
             */
            render: function () {
                var settingsView = new QoobFieldsView({
                    model: this.model,
                    settings: this.settings,
                    defaults: this.defaults,
                    storage: this.storage,
                    controller: this.controller,
                    parentId: this.model.id
                });
                this.$el.html(this.tpl({id: "settings-block-" + this.parentId, currentId: "settings-block-" + this.model.id, 'back': this.storage.__('back', 'Back')}));
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
            backward: function (e) {
                if (e) {
                    e.preventDefault();
                }
                this.controller.layout.menu.rotateBackward(this.parentId);
            }
        });

