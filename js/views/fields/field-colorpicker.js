var Fields = Fields || {};
Fields.colorpicker = Backbone.View.extend(
/** @lends Fields.colorpicker.prototype */{
    className: "settings-item",
    events: {
        'change input': 'changeInput',
        'click .theme-colors': 'changeColor',
        'click .change-color': 'changeColorPicker'
    },
    /**
     * View field colorpicker
     * @class Fields.colorpicker
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.storage=options.storage;
        this.settings=options.settings;
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
     * Get value field colorpicker
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.settings.name) || this.settings.default;
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

        this.$el.html(_.template(this.storage.builderTemplates['field-colorpicker-preview'])(htmldata));
        return this;
    }
});