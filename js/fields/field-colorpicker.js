var Fields = Fields || {};
Fields.colorpicker = Backbone.View.extend(
/** @lends Fields.colorpicker.prototype */{
    className: "settings-item",
    events: {
        'change input': 'changeInput',
        'click .other-color': 'changeColor'
    },
    /**
     * View field colorpicker
     * @class Fields.colorpicker
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
    },
    /**
     * Event change colorpicker
     * @param {Object} evt
     */
    changeInput: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.prev().find('.active').children().css('background-color'));
    },
    /**
     * Get value field colorpicker
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Get other colors
     * @returns {String}
     */
    getOherColors: function () {
        var colors = '';
        for (var i = 0; i < this.config.colors.length; i++) {
            colors += '<div class="other-color ' + (this.config.colors[i] == this.getValue() ? 'active' : '') + '"><span style="background-color: ' + this.config.colors[i] +'"></span></div>';
        }
        return '<div class="other-colors">' + colors + '</div>';
    },
    /**
     * Change other image
     * @param {Object} evt
     */
    changeColor: function (evt) {
        var elem = jQuery(evt.currentTarget);
        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');
        console.log('ddd');
        this.$el.find('input').trigger("change");
//        this.$el.find('.edit-image img').attr('src', elem.find('img').attr('src'));
//        console.log(this.$el.find('input').trigger("change"));
//        this.$el.find('input').trigger("change");
//        if (!this.$el.find('.edit-image').is(":visible")) {
//            this.$el.find('.edit-image').show();
//        }
    },
    /**
     * Create filed colorpicker
     * @returns {String}
     */
    create: function () {
        var block = '<div class="title">'+this.config.label+'</div>' + 
                 (this.config.colors ? this.getOherColors() : '') +
                 '<button class="change-color other-color" data-wheelcolorpicker data-wcp-preview="true" id="color-input"></button>' +
                 '<input type="hidden" name="' + this.config.name + '" value="' + this.getValue() + '">'
                
        var colorpicker = "<script type='text/javascript'>" +
                "jQuery(function() {" + 
                    "jQuery('#color-input').wheelColorPicker();" + 
                    "jQuery('#color-input').on('slidermove', function() {"+
                        "jQuery('#event-color').val(jQuery(this).wheelColorPicker('getValue', 'rgb'));"+
                    "});" + 
                "});" + 
                "</script>";
        return  [block, colorpicker];
    },
    /**
     * Render filed colorpicker
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});