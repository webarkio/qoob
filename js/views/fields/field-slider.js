var Fields = Fields || {};
Fields.slider = Backbone.View.extend(
/** @lends Fields.slider.prototype */{
    className: "settings-item",
    events: {
        'change input': 'changeInput'
    },
    /**
     * View field slider
     * @class Fields.slider
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
     * Get value field slider
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.settings.name) || this.settings.default;
    },
    /**
     * Render filed slider
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "sliderId" : _.uniqueId('slider'),
            "sizeId" : _.uniqueId('size'),
            "label" : this.settings.label,
            "name" : this.settings.name,
            "value" : this.getValue()
        };
        
        this.$el.html(_.template(this.storage.builderTemplates['field-slider-preview'])(htmldata));
        return this;
    }
});