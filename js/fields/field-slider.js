var Fields = Fields || {};
Fields.slider = Backbone.View.extend(
/** @lends Fields.slider.prototype */{
    className: "settings-item",
    sliderTpl: null,
    events: {
        'change input': 'changeInput'
    },
    /**
     * View field slider
     * @class Fields.slider
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
         this.sliderTpl = _.template(builder.storage.getBuilderTemplate('field-slider'));
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
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Render filed slider
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "sliderId" : _.uniqueId('slider'),
            "sizeId" : _.uniqueId('size'),
            "label" : this.config.label,
            "name" : this.config.name,
            "value" : this.getValue()
        }
        this.$el.html(this.sliderTpl( htmldata ));
        return this;
    }
});