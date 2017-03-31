/*global QoobFieldView*/
var Fields = Fields || {};
Fields.colorpicker = QoobFieldView.extend(
/** @lends Fields.colorpicker.prototype */{
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
        var input = elem.closest('.settings-item').find('.colorpicker-input');
        var color = elem.data('color');
        input.val(color);
        input.css({"backgroundColor" : color});
        this.model.set(input.prop('name'), color);
    },
    changeInput: function(evt) {
        var target = jQuery(evt.target);
        jQuery(evt.target).css({"backgroundColor" : target.val()});
        this.model.set(target.attr('name'), target.val());
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