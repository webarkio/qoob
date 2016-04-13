var Fields = Fields || {};
Fields.textarea = Backbone.View.extend(
/** @lends Fields.textarea.prototype */{
    className: "settings-item",
    texareaTpl: null,
    events: {
        'change textarea': 'changeTextarea'
    },
    /**
     * View field textarea
     * @class Fields.textarea
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.textareaTpl = _.template(builder.storage.getFieldTemplate('field-textarea'));
    },
    /**
     * Event change textarea
     * @param {Object} evt
     */
    changeTextarea: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Get value field textarea
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },

    /**
     * Render filed textarea
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.config.label,
            "name" : this.config.name,
            "value" : this.getValue(),
            "textareaId" : _.uniqueId('textarea')
        }

        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.textareaTpl( htmldata ));
        }
        
        return this;
    }
});