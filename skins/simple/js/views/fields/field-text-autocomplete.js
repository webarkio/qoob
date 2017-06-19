var Fields = Fields || {};
Fields.text_autocomplete = QoobFieldView.extend(
/** @lends Fields.text_autocomplete.prototype */{
    uniqueId: null,
    events: {
        'keyup input': 'changeInput'
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
     * Get unique id
     * @returns {String}
     */
    getUniqueId: function () {
        return this.uniqueId = this.uniqueId || _.uniqueId('text-');
    },
    /**
     * Render filed text
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.settings.label,
            "name" : this.settings.name,
            "value" : this.getValue(),
            "placeholder" : this.settings.placeholder,
            "uniqueId" : this.getUniqueId()
        };
        this.$el.html(_.template(this.storage.getSkinTemplate('field-text-autocomplete-preview'))(htmldata));
        return this;
    }
});