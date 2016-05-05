var Fields = Fields || {};
Fields.textarea = Backbone.View.extend(
/** @lends Fields.textarea.prototype */{
    className: "settings-item",
    texareaTpl: null,
    events: {
        'change textarea': 'changeTextarea'
    },
    /**
     * View field textarea
     * @class Fields.textarea
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.storage=options.storage;
        this.settings=options.settings;
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
     * Get value field textarea
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.settings.name) || this.settings.default;
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
        }
        this.$el.html(_.template(this.storage.builderTemplates['field-textarea'])(htmldata));
        // if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
        //     this.$el.html(this.textareaTpl( htmldata ));
        // }
        
        return this;
    }
});