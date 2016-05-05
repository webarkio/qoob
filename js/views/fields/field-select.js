var Fields = Fields || {};
Fields.select = Backbone.View.extend(
    /** @lends Fields.select.prototype */
    {
        className: "settings-item",
        selectTpl: null,
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
        initialize: function() {
            var self = this;
            builder.storage.getBuilderTemplate('field-select', function(err, data){
                self.selectTpl = _.template(data);
            });
        },
        /**
         * Event change colorpicker
         * @param {Object} evt
         */
        changeInput: function(evt) {
            var target = jQuery(evt.target);
            this.model.set(target.attr('name'), target.parent().find('.active').attr("id"));
        },
        /**
         * Event change select
         * @param {Object} evt
         */
        changeSelect: function(evt) {
            var target = jQuery(evt.target);
            this.model.set(target.attr('name'), target.val());
        },
        /**
         * Change other image
         * @param {Object} evt
         */
        changeColor: function(evt) {
            var elem = jQuery(evt.currentTarget);
            this.$el.find('.other-color').removeClass('active');
            elem.addClass('active');
            this.$el.find('input').trigger("change");
        },

        /**
         * Render filed select
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                "label": this.config.label,
                "name": this.config.name,
                "current": this.model.get(this.config.name) || this.config.default,
                "options": this.config.options,
                "visible_color": this.config.visible_color
            }
            this.$el.html(this.selectTpl(htmldata));
            return this;
        }
    });
