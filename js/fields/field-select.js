var Fields = Fields || {};
Fields.select = Backbone.View.extend(
/** @lends Fields.select.prototype */{
    className: "settings-item",
    events: {
        'change select': 'changeSelect'
    },
    /**
     * View field select
     * @class Fields.select
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
    },
    /**
     * Event change select
     * @param {Object} evt
     */
    changeSelect: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Get value field select
     * @returns {String}
     */
    getValue: function () {
        var current = this.model.get(this.config.name) || this.config.default,
            options = this.config.options,
            res = "";
        for (i = 0; i < this.config.options.length; i++) {
            var selected = current == options[i].id ? 'selected' : '';
            res += "<option " + selected + " value='" + options[i].id + "'>" + options[i].val + "</option>";
        }
        return res;
    },
    /**
     * Create filed select
     * @returns {String}
     */
    create: function () {
        return '<div class="title">' + this.config.label + '</div>' +
                '<select class="select" name="' + this.config.name + '">' + this.getValue() + '</select>';
    },
    /**
     * Render filed select
     * @returns {Object}
     */
    render: function () {
        this.$el.html(this.create());
        return this;
    }
});
