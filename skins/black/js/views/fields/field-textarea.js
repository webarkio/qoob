var Fields = Fields || {};
Fields.textarea = QoobFieldView.extend(
/** @lends Fields.textarea.prototype */{
    events: {
        'change': 'changeTextarea'
    },
    /**
     * Event change textarea
     * @param {Object} evt
     */
    changeTextarea: function (evt, quill) {
        this.model.set(this.settings.name, quill.root.innerHTML);
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

        this.$el.html(_.template(this.storage.getSkinTemplate('field-textarea-preview'))(htmldata));
        return this;
    }
});