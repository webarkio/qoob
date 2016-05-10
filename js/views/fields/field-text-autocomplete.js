var Fields = Fields || {};
Fields.text_autocomplete = Backbone.View.extend(
/** @lends Fields.text_autocomplete.prototype */{
    className: "settings-item",
    uniqueId: null,
    events: {
        'keyup input': 'changeInput'
    },
    /**
     * View field text
     * @class Fields.text
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.storage = options.storage;
        this.settings = options.settings;
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
     * Get value field text
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.settings.name) || this.settings.default;
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
        
        this.$el.html(_.template(this.storage.builderTemplates['field-text-autocomplete'])(htmldata));
        return this;
    }
});