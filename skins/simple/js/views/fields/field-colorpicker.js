/*global QoobFieldView*/
var Fields = Fields || {};
Fields.colorpicker = QoobFieldView.extend(
    /** @lends Fields.colorpicker.prototype */
    {
        className: 'field-color-picker field-group',
        events: {
            'click .theme-colors': 'changeListColor',
            'keyup input': 'changeInput'
        },
        checkRgb: function(rgb) {
            var rxValidRgb = /([R][G][B][A]?[(]\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\s*,\s*([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])(\s*,\s*((0\.[0-9]{1})|(1\.0)|(1)))?[)])/i
            if (rxValidRgb.test(rgb)) {
                return true;
            }
        },
        changeInput: function(evt) {
            var color = jQuery(evt.target).val().trim();
            this.changeColor(color);
        },
        /**
         * Change other color
         * @param {Object} evt
         */
        changeListColor: function(evt) {
            var color = jQuery(evt.currentTarget).data('color').trim();
            this.$el.find('.field-color-picker__input').val(color);
            this.changeColor(color);
        },
        isBlackColor: function (color) {
            return ['#000', '#000000', 'rgb(0,0,0)'].indexOf(color) !== -1;
        },
        changeColor: function(color) {
            var input = this.$el.find('.field-color-picker__input'),
                container = this.$el.find('.field-color-picker__container');

            // hex or rgb
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/i.test(color) || this.checkRgb(color)) {
                if (this.isBlackColor(color)) {
                    input.addClass('field-color-picker__input__light');
                } else {
                    input.removeClass('field-color-picker__input__light');
                }
                container.css({ "backgroundColor": color });
                this.model.set(this.name, color);
            }
        },
        /**
         * Render filed colorpicker
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                "label": this.settings.label,
                "name": this.settings.name,
                "value": this.getValue(),
                "colors": this.settings.colors
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('field-colorpicker-preview'))(htmldata));

            if (this.isBlackColor(this.getValue())) {
                this.$el.find('.field-color-picker__input').addClass('field-color-picker__input__light');
            }

            return this;
        }
    });