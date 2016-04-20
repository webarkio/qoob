var Fields = Fields || {};
Fields.text = Backbone.View.extend(
/** @lends Fields.text.prototype */{
    className: "settings-item",
    textTpl: null,
    events: {
        'keyup input': 'changeInput'
    },
    /**
     * View field text
     * @class Fields.text
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.textTpl = _.template(builder.storage.getBuilderTemplate('field-text'));
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    changeInput: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Get value field text
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },

    /**
     * Render filed text
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.config.label,
            "name" : this.config.name,
            "value" : this.getValue(),
            "placeholder" : this.config.placeholder
        }

        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.textTpl( htmldata ));
        }

        return this;
    }
});