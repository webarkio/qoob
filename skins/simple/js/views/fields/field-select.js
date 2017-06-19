var Fields = Fields || {};
Fields.select = QoobFieldView.extend(
/** @lends Fields.select.prototype */{
    events: {
        'change select': 'changeSelect',
        'change input': 'changeInput',
        'click .theme-colors': 'changeColor',
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
            "label": this.settings.label,
            "name": this.settings.name,
            "current": this.model.get(this.settings.name) || this.settings.default,
            "options": this.settings.options,
            "visible_color": this.settings.visible_color
        };

        this.$el.html(_.template(this.storage.getSkinTemplate('field-select-preview'))(htmldata));
        return this;
    }
});
