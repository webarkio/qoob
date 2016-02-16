var Fields = Fields || {};
Fields.checkbox = Backbone.View.extend(
/** @lends Fields.checkbox.prototype */{
    className: "settings-item",
    events: {
        'change input': 'changeInput'
    },
    /**
     * View field checkbox
     * @class Fields.checkbox
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
        this.model.set(target.attr('name'), target[0].checked);

        var elem = target.parents('.checkbox-switcher').next('.status').find('span');
        elem.toggleClass('status-on');       
    },
    /**
     * Get checked
     * @returns {String}
     */
    checked: function () {
        return (this.model.get(this.config.name)) ? "checked" : "";
    },
    /**
     * Create filed checkbox
     * @returns {String}
     */
    create: function () {
        return '<div class="title">' + this.config.label + '</div>' +
        '<div class="checkbox-switcher">' +
        '<label>' +
        '<input name="' + this.config.name + '" type="checkbox" ' + this.checked() + '><span></span>' +
        '</label>' +
        '</div>' +
        '<div class="status"><span class="status-on">On</span> / Off</div>';
    },
    /**
     * Render filed checkbox
     * @returns {Object}
     */
    render: function () {
        this.$el.html(this.create());
        return this;
    }
});
