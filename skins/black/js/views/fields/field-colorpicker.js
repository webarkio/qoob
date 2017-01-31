var Fields = Fields || {};
Fields.colorpicker = QoobFieldView.extend(
/** @lends Fields.colorpicker.prototype */{
    events: {
        'click .theme-colors': 'changeColor',
        'click .change-color': 'changeColorPicker'
    },
    /**
     * Change color with colorpicker
     * @param {Object} evt
     */
    changeColorPicker: function (evt) {
        var elem = jQuery(evt.currentTarget),
            name = elem.closest('.settings-item').find('input').prop('name'),
            model = this.model,
            color;
        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');

        color = this.hexc(elem.css('background-color'));

        if ((color != 'transparent') && (color != 'rgba(0, 0, 0, 0)')) {
            
            model.set(name, color);
        }
        elem.on('slidermove', function () {
            elem.addClass('active');
            model.set(name, color);
        });
    },
    /**
     * Convert rgb to hex color
     * @param {String} colorval
     * @returns {String}
     */
    hexc: function (colorval) {
        var parts = colorval.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        delete(parts[0]);

        for (var i = 1; i <= 3; ++i) {
            parts[i] = parseInt(parts[i]).toString(16);
            if (parts[i].length == 1) parts[i] = '0' + parts[i];
        }
        color = '#' + parts.join('');

        return color;
    },
    /**
     * Change other image
     * @param {Object} evt
     */
    changeColor: function (evt) {
        var elem = jQuery(evt.currentTarget);
        var name = elem.closest('.settings-item').find('input').prop('name');

        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');

        var color = this.hexc(elem.css('background-color'));
        this.model.set(name, color);
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

        this.$el.html(_.template(this.storage.getSkinTemplate('field-colorpicker-preview'))(htmldata));
        return this;
    }
});