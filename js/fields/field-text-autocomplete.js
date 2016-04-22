var Fields = Fields || {};
Fields.text_autocomplete = Backbone.View.extend(
/** @lends Fields.text_autocomplete.prototype */{
    className: "settings-item",
    uniqueId: null,
    textAutocompletTpl: null,
    events: {
        'keyup input': 'changeInput'
    },
    /**
     * View field text
     * @class Fields.text
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        var self = this;
        builder.storage.getBuilderTemplate('field-text-autocomplete', function(err, data){
            self.textAutocompletTpl = _.template(data);
        });
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
        return this.model.get(this.config.name) || this.config.default;
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
            "label" : this.config.label,
            "name" : this.config.name,
            "value" : this.getValue(),
            "placeholder" : this.config.placeholder,
            "uniqueId" : this.getUniqueId()
        }

        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.textAutocompletTpl( htmldata ));
        }
        return this;
    }
});