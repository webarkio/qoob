var Fields = Fields || {};
Fields.checkbox_switch = QoobFieldView.extend(
/** @lends Fields.checkbox.prototype */{
    events: {
        'change input': 'changeSwitch'
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    changeSwitch: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), (target[0].checked == false ? 0 : 1));
    },
    /**
     * Get boolean value
     * @param {String} val
     * @returns {Boolean}
     */
    getBool: function (val){ 
        if(val == undefined) {
            return false;
        }
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
    },
    /**
     * Get checked
     * @returns {String}
     */
    checked: function () {        
        if (this.model.get(this.settings.name)) {
            return this.getBool(this.model.get(this.settings.name));
        } else {
            return this.getBool(this.settings.default);
        }
    },
    /**
     * Get unique id
     * @returns {String}
     */
    getUniqueId: function () {
        return this.uniqueId = this.uniqueId || _.uniqueId('checkbox-switch-');
    },
    /**
     * Render filed checkbox
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.settings.label,
            "name" : this.settings.name,
            "uniqueId" : this.getUniqueId(),
            "checked" : (this.checked()  ? "checked" : "")
        };
        this.$el.html(_.template(this.storage.getSkinTemplate('field-checkbox-switch-preview'))(htmldata));
        return this;
    }
});
