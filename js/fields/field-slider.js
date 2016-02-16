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
    initialize: function () {
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
     * Create filed slider
     * @returns {String}
     */
    create: function () {
        var sliderId = _.uniqueId('slider'),
        sizeId = _.uniqueId('size');

        return  '<div class="title">' + this.config.label + '</div>' +
                '<div id="' + sliderId + '" class="sliders-size"></div>' +
                '<input class="size" name="' + this.config.name + '" type="text" id="' + sizeId + '" value="' + this.getValue() +'">' +
                '<script type="text/javascript">' +
                'jQuery("#' + sliderId +'").slider({' +
                'value: ' + this.getValue() +',' +
                'min: 0,' +
                'max: 100,' +
                'step: 1,' +
                'slide: function (event, ui) {' +
                'jQuery("#' + sizeId +'").val(ui.value);' +
                'jQuery("#' + sizeId +'").trigger("change");' +
                '}' +
                '});' +
                '</script>';
    },
    /**
     * Render filed slider
     * @returns {Object}
     */
    render: function () {
        this.$el.html(this.create());
        return this;
    }
});