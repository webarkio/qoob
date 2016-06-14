var Fields = Fields || {};
Fields.colorpicker = FieldView.extend(
/** @lends Fields.colorpicker.prototype */{
    events: {
        'change input': 'changeInput',
        'click .theme-colors': 'changeColor',
        'click .change-color': 'changeColorPicker'
    },
    /**
     * Event change colorpicker
     * @param {Object} evt
     */
    changeInput: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.parent().find('.active').css('background-color'));
    },
    /**
     * Change color with colorpicker
     * @param {Object} evt
     */
    changeColorPicker: function (evt) {
        var elem = jQuery(evt.currentTarget),
            name = elem.closest('.settings-item').find('input').prop('name'),
            model = this.model;
        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');
        if ((elem.css('background-color') != 'transparent') && (elem.css('background-color') != 'rgba(0, 0, 0, 0)')) {
            model.set(name, elem.css('background-color'));
        }
        elem.on('slidermove', function () {
            elem.addClass('active');
            model.set(name, elem.css('background-color'));
        });
    },
    /**
     * Change other image
     * @param {Object} evt
     */
    changeColor: function (evt) {
        var elem = jQuery(evt.currentTarget);
        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');
        this.$el.find('input').trigger("change");
    },
    /**
     * Render filed colorpicker
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "label" : this.settings.label,
            "name" : this.settings.name,
            "value" : this.getValue(),
            "arr_colors" : jQuery.inArray(this.getValue(), this.settings.colors),
            "colors" : this.settings.colors
        };

        this.$el.html(_.template(this.storage.qoobTemplates['field-colorpicker-preview'])(htmldata));
        return this;
    }
});