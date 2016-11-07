var Fields = Fields || {};
Fields.slider = QoobFieldView.extend(
/** @lends Fields.slider.prototype */{
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
            "value" : this.getValue()
        };
        
        this.$el.html(_.template(this.storage.getSkinTemplate('field-slider-preview'))(htmldata));
        return this;
    }
});