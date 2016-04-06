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
            initialize: function () {
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
                return this.model.get(this.config.name) || this.config.default;
            },
            /**
             * Get colors btn
             * @returns {String}
             */
            getColorBtn: function () {
                var arr_colors = jQuery.inArray(this.getValue(), this.config.colors);
                var btn = '<button class="change-color other-color ' + (arr_colors == -1 ? 'active' : '') +
                        '" data-wheelcolorpicker data-wcp-preview="true" data-wcp-sliders="wv" id="color-input" ' + (arr_colors == -1 ? 'style="background: ' + this.getValue() + '"' : '') + '"></button>';

                return btn;
            },
            /**
             * Get other colors
             * @returns {String}
             */
            getOherColors: function () {
                var colors = '';
                for (var i = 0; i < this.config.colors.length; i++) {
                    this.config.colors[i]
                    colors += '<div class="other-color theme-colors ' + (this.config.colors[i] == this.getValue() ? 'active' : '') + '" style="background: ' + this.config.colors[i] + '"><span ></span></div>';
                }
                return '<div class="other-colors">' + colors + '</div>';
            },
            /**
             * Change color with colorpicker
             * @param {Object} evt
             */
            changeColorPicker: function (evt) {
                var elem = jQuery(evt.currentTarget);
                var name = elem.closest('.settings-item').find('input').prop('name');
                var model = this.model;
                this.$el.find('.other-color').removeClass('active');
                elem.addClass('active');
                if (elem.css('background-color') != 'rgba(0, 0, 0, 0)'){
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
             * Create filed colorpicker
             * @returns {String}
             */
            create: function () {
                var block = '<div class="title">' + this.config.label + '</div>' +
                        (this.config.colors ? this.getOherColors() : '') +
                        this.getColorBtn() +
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