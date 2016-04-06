var Fields = Fields || {};
Fields.colorpicker = Backbone.View.extend(
/** @lends Fields.colorpicker.prototype */{
    className: "settings-item",
    events: {
        'change input': 'changeInput',
        'click .other-color': 'changeColor',
        'click .change-color': 'changeColorPicker'
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
        console.log('dd');
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.parent().find('.active').css('background-color'));
    },
    /**
     * Get value field colorpicker
     * @returns {String}
     */
    getValue: function () {
        console.log('dd');
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Get other colors
     * @returns {String}
     */
    getOherColors: function () {
        console.log(this.config.colors[i]);
        console.log(this.getValue());
        var colors = '';
        for (var i = 0; i < this.config.colors.length; i++) {
            colors += '<div class="other-color theme-colors ' + (this.config.colors[i] == this.getValue() ? 'active' : '') + '" style="background: ' + this.config.colors[i] +'"><span ></span></div>';
        }
        return '<div class="other-colors">' + colors + '</div>';
    },
    /**
     * Change color with colorpicker
     * @param {Object} evt
     */
    changeColorPicker: function (evt) {
        console.log('single-colors ' + this.config.colors);
        console.log('values ' + this.getValue())
        var elem = jQuery(evt.currentTarget);
        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');
        this.$el.find('input').trigger("change");
        
        var name = elem.closest('.settings-item').find('input').prop('name');
        var model = this.model;
        elem.on('slidermove', function() {
            elem.addClass('active');
            model.set(name, elem.css('background-color'));
        });
    },
    /**
     * Change other image
     * @param {Object} evt
     */
    changeColor: function (evt) {
        console.log('dd');
        var elem = jQuery(evt.currentTarget);
        this.$el.find('.other-color').removeClass('active');
        elem.addClass('active');
        this.$el.find('input').trigger("change");
    },
    /**
     * Create filed colorpicker
     * @returns {String}
     */
    create: function () {
        console.log(this.config.colors );
        var block = '<div class="title">'+this.config.label+'</div>' + 
                 (this.config.colors ? this.getOherColors() : '') +
                 '<button class="change-color other-color' + (this.config.colors[i] == this.getValue() ? 'active' : '') + '" data-wheelcolorpicker data-wcp-preview="true" data-wcp-sliders="wv" id="color-input"></button>' +
                 '<input type="hidden" name="' + this.config.name + '" value="' + this.getValue() + '">'
                
        var colorpicker = "<script type='text/javascript'>" +
                "jQuery(function() {" + 
                    "jQuery('#color-input').wheelColorPicker();" + 
                    "jQuery('.settings-block').scroll(function(){" + 
                        "jQuery('.jQWCP-wWidget').hide();" + 
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