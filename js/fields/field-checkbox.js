var Fields = Fields || {};
Fields.checkbox = Backbone.View.extend(
/** @lends Fields.checkbox.prototype */{
    className: "settings-item",
    checkboxTpl : null,
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
        this.checkboxTpl = _.template(builder.storage.getFieldTemplate('field-checkbox'));
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    changeInput: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), (target[0].checked == false ? 0 : 1));

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
     * Render filed checkbox
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.config.label,
            "name" : this.config.name,
            "status" : (this.checked() ? "status-on" : ""),
            "checked" : (this.checked()  ? "checked" : "")
        }

        this.$el.html(this.checkboxTpl( htmldata ));
        return this;
    }
});
