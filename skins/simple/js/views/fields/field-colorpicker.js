/*global QoobFieldView*/
var Fields = Fields || {};
Fields.colorpicker = QoobFieldView.extend(
/** @lends Fields.colorpicker.prototype */{
    className: 'field-color-picker field-group',
    events: {
        'click .theme-colors': 'changeColor',
        'keyup input': 'changeInput'
    },
    /**
     * Change other image
     * @param {Object} evt
     */
    changeColor: function (evt) {
        var elem = jQuery(evt.currentTarget);
        // var input = elem.closest('.colorpicker-input');
        var input = elem.closest('.field-color-picker').find('.colorpicker-input');
        var color = elem.data('color');
        
        input.val(color);
        
        input.css('color', this.inputColor(color));
        input.css({"backgroundColor" : color});
        
        this.model.set(input.prop('name'), color);
    },
    /**
     * Transform hex color to rgb color
     * @param {String} hex - Color that will be converted to rgb
     */
    hexToRgb: function (hex) {
        var bigint = parseInt(hex.replace(/#/, ""), 16);

        var r = (bigint >> 16) & 255;
        var g = (bigint >> 8) & 255;
        var b = bigint & 255;

        return "rgb("+ r + "," + g + "," + b + ")";
    },
    /**
     * Color for input text
     * @param {String} color - Color in hex format that user has entered or selected  
     * @return {String} Text's color for input element
     */
    inputColor: function(color) {
            var rgbColor = this.hexToRgb(color);
            
            var colors = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            var brightness = 1;

            var r = colors[1];
            var g = colors[2];
            var b = colors[3];

            var ir = Math.floor((255-r)*brightness);
            var ig = Math.floor((255-g)*brightness);
            var ib = Math.floor((255-b)*brightness);

            return 'rgb('+ir+','+ig+','+ib+')';
    },
    changeInput: function(evt) {
        var target = jQuery(evt.target);
        var color = target.val();

        if( color.length === 7 ) {
            jQuery(evt.target).css('color', this.inputColor(color));
            jQuery(evt.target).css({"backgroundColor" : target.val()});
        }
        
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Render filed colorpicker
     * @returns {Object}
     */
    render: function () {
        if(this.getValue() !== undefined ) {
           var inputColor = this.inputColor(this.getValue());
        }
        var htmldata = {
            "label" : this.settings.label,
            "name" : this.settings.name,
            "value" : this.getValue(),
            "arr_colors" : jQuery.inArray(this.getValue(), this.settings.colors),
            "colors" : this.settings.colors,
            "inputColor": inputColor
        };

        this.$el.html(_.template(this.storage.getSkinTemplate('field-colorpicker-preview'))(htmldata));
        return this;
    }
});