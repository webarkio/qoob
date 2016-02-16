var Fields = Fields || {};
Fields.text = Backbone.View.extend(
/** @lends Fields.text.prototype */{
    className: "settings-item",
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
     * Create filed text
     * @returns {String}
     */
    create: function () {
        return '<div class="title">'+this.config.label+'</div>' + '<input class="input-text" type="text" name="' + this.config.name + '" value="' + this.getValue() + '" placeholder="'+ this.config.placeholder +'">';
    },
    /**
     * Render filed text
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});