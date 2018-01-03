/*global QoobFieldsView*/
/**
 * Create accordion item flip view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipItemSettingsView = QoobFieldsView.extend( // eslint-disable-line no-unused-vars
    {
        className: "settings menu-block accordion-item",
        /**
         * Set setting's id
         * @class AccordionFlipItemSettingsView
         * @augments QoobFieldsView
         * @constructs
         */
        attributes: function() {
            return {
                id: "settings-block-" + this.model.id,
                'data-side-id': this.model.id
            };
        },
        events: {
            'click .settings-buttons__delete': 'deleteInnerSettings',
            'click .backward-button': 'clickBackward'
        },
        initialize: function(options) {
            QoobFieldsView.prototype.initialize.call(this, options);
        },
        clickBackward: function() {
            this.controller.backward();
        },
        /**
         * Render accordion item flip view
         * @returns {Object}
         */
        render: function() {
            this.$el.html(_.template(this.storage.getSkinTemplate('field-accordion-item-flip-view-preview'))({'back': this.storage.__('back', 'Back')}));
            this.$el.find('.settings-blocks').html(QoobFieldsView.prototype.getHtml.apply(this, arguments));
            return this;
        },
        deleteInnerSettings: function() {
            this.controller.backward();
            this.model.trigger('delete_model', this);
        },
        /**
         * Remove view
         */
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