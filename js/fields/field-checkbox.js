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
        this.model.set(target.attr('name'), (target[0].checked == false ? 0 : target[0].checked));

        var elem = target.parents('.checkbox-switcher').next('.status').find('span');
        elem.toggleClass('status-on');
    },
    /**
     * Get boolean value
     * @param {String} val
     * @returns {Boolean}
     */
    getBool: function (val){ 
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
    },
    /**
     * Get checked
     * @returns {String}
     */
    checked: function () {        
        if (this.model.get(this.config.name)) {
            return this.getBool(this.model.get(this.config.name));
        } else {
            return this.getBool(this.config.default);
        }
    },
    /**
     * Create filed checkbox
     * @returns {String}
     */
    create: function () {
        return '<div class="title">' + this.config.label + '</div>' +
                '<div class="checkbox-switcher">' +
                '<label>' +
                '<input name="' + this.config.name + '" type="checkbox" ' + (this.checked()  ? "checked" : "") + '><span></span>' +
                '</label>' +
                '</div>' +
                '<div class="status"><span class="' + (this.checked() ? "status-on" : "") + '">On</span> / Off</div>';
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
