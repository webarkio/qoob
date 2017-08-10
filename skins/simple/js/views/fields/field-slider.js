var Fields = Fields || {};
Fields.slider = QoobFieldView.extend(
/** @lends Fields.slider.prototype */{
    className: 'field-slider field-group',
    events: {
        'change input': 'changeInput'
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
     * Render filed slider
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "sliderId" : _.uniqueId('slider'),
            "sizeId" : _.uniqueId('size'),
            "label" : this.settings.label,
            "name" : this.settings.name,
            "min" : this.settings.min || 0,
            "max" : this.settings.max || 100,
            "value" : this.getValue() || 0
        };
        
        this.$el.html(_.template(this.storage.getSkinTemplate('field-slider-preview'))(htmldata));
        return this;
    }
});