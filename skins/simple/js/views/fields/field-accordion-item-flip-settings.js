/*global QoobFieldsView*/
/**
 * Create accordion item flip view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipView = QoobFieldsView.extend( // eslint-disable-line no-unused-vars
        /** @lends AccordionFlipView.prototype */{
            className: "settings menu-block accordion-item",
            /**
             * Set setting's id
             * @class fieldsView
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
                'click .delete-item-accordion': 'deleteInnerSettings'
            },
            /**
             * Render accordion item flip view
             * @returns {Object}
             */
            render: function () {
                this.$el.html(_.template(this.storage.getSkinTemplate('field-accordion-item-flip-view-preview'))());
                this.$el.find('.settings-blocks').html(QoobFieldsView.prototype.getHtml.apply(this, arguments));
                return this;
            },
            deleteInnerSettings: function () {
                this.model.trigger('delete_model', this);
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
            }
        });

