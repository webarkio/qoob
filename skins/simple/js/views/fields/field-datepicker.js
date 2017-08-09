var Fields = Fields || {};
Fields.datepicker = QoobFieldView.extend(
/** @lends Fields.radio.prototype */{
    className: 'field-datepicker field-group',
    events: {
        'change .field-datepicker__input': 'changeInput',
    },
    /**
     * Event change colorpicker
     * @param {Object} evt
     */
    changeInput: function(evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Get unique id
     * @returns {String}
     */
    getUniqueId: function () {
        return this.uniqueId = this.uniqueId || _.uniqueId('dt-');
    },
    /**
     * Render filed select
     * @returns {Object}
     */
    render: function() {
        var htmldata = {
            "label": this.settings.label,
            "name": this.settings.name,
            "value" : this.getValue(),
            "uniqueId": this.getUniqueId()
        };

        this.$el.html(_.template(this.storage.getSkinTemplate('field-datepicker-preview'))(htmldata));
        return this;
    }
});