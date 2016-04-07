var Fields = Fields || {};
Fields.select = Backbone.View.extend(
        /** @lends Fields.select.prototype */{
            className: "settings-item",
            events: {
                'change select': 'changeSelect',
                'change input': 'changeInput',
                'click .theme-colors': 'changeColor',
            },
            /**
             * View field select
             * @class Fields.select
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
                this.model.set(target.attr('name'), target.parent().find('.active').attr("id"));
            },
            /**
             * Event change select
             * @param {Object} evt
             */
            changeSelect: function (evt) {
                var target = jQuery(evt.target);
                this.model.set(target.attr('name'), target.val());
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
             * Get value field select
             * @returns {String}
             */
            getValue: function () {
                var current = this.model.get(this.config.name) || this.config.default,
                        options = this.config.options,
                        res = "";
                for (i = 0; i < this.config.options.length; i++) {
                    var selected = current == options[i].id ? 'selected' : '';
                    res += "<option " + selected + " value='" + options[i].id + "'>" + options[i].val + "</option>";
                }
                return '<select class="select" name="' + this.config.name + '">' + res + '</select>';
            },
            /**
             * Get value and color field select
             * @returns {String}
             */
            getColor: function () {
                var current = this.model.get(this.config.name) || this.config.default,
                    options = this.config.options,
                    res = '';
                for (var i = 0; i < this.config.options.length; i++) {
                    var active = current == options[i].id ? 'active' : '';
                    res += '<div id="' + options[i].id +'" class="other-color theme-colors ' + active + '" style="background: ' + this.config.options[i].colorimage + '"><span ></span></div>';
                }
                var input = '<input type="hidden" name="' + this.config.name + '" value="">'
                return '<div class="other-colors">' + res + '</div>' + input;
            },
            /**
             * Create filed select
             * @returns {String}
             */
            create: function () {
                var res = '';
                (this.config.visible_color === (undefined) || 
                        this.config.visible_color === ('false')) ? res = this.getValue() : res = this.getColor();
                return '<div class="title">' + this.config.label + '</div>' + res
            },
            /**
             * Render filed select
             * @returns {Object}
             */
            render: function () {
                this.$el.html(this.create());
                return this;
            }
        });
