/*global QoobFieldsView */
/**
 * Create field accordion item settings
 * 
 * @type @exp;QoobFieldsView@call;extend
 */

var FieldAccordionItemSettings = QoobFieldsView.extend( // eslint-disable-line no-unused-vars
    {
        className: "field-accordion-settings",

        /**
         * View field accordion item
         * needed for field accordion
         * @class FieldAccordionItemSettings
         * @augments QoobFieldsView
         * @constructs
         */
        initialize: function(options) {
            QoobFieldsView.prototype.initialize.call(this, options);
        },
        /**
         * Render accordion item settings
         * @returns {Object}
         */
        render: function() {
            this.$el.html(QoobFieldsView.prototype.getHtml.apply(this, arguments));
            return this;
        }
    });