var Fields = Fields || {};
Fields.textarea = FieldView.extend(
/** @lends Fields.textarea.prototype */{
    events: {
        'change textarea': 'changeTextarea'
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
     * Render filed textarea
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.settings.label,
            "name" : this.settings.name,
            "value" : this.getValue(),
            "textareaId" : _.uniqueId('textarea')
        };
        this.$el.html(_.template(this.storage.qoobTemplates['field-textarea-preview'])(htmldata));
        return this;
    }
});