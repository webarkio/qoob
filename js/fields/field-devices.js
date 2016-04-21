var Fields = Fields || {};
Fields.devices = Backbone.View.extend(
/** @lends Fields.devices.prototype */{
    className: "settings-item",
    devicesTpl: null,
    events: {
        'click .btn-group a': 'clickDevice'
    },
    /**
     * View field devices
     * @class Fields.devices
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.devicesTpl = _.template(builder.storage.getBuilderTemplate('field-devices'));
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    clickDevice: function (evt) {
        evt.preventDefault();
        var target = jQuery(evt.currentTarget);
        target.toggleClass('no-active');

        var input = this.$el.find('input[name="'+this.config.name+'"]');        
        var devices = this.$el.find('.btn-group a');
        
        var active = [];
        for (var i = 0; i < devices.length; i++) {
            if (jQuery(devices[i]).hasClass('no-active')) {
                active.push(jQuery(devices[i]).data('device'));
            }
        }

        input.val(active);
        this.model.set(this.config.name, active.join(','));
        
        builder.viewPort.visibilityBlocks(this.model.id, active);
    },
    /**
     * Get value field devices
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Create filed devices
     * @returns {String}
     */
    create: function () {
        var devices = this.getValue();
        var settings = this.config.settings;
             
        var devices_elem = '';
        for (var i = 0; i < settings.length; i++) {
            devices_elem += '<a href="#" class="btn ' + (devices.indexOf(settings[i].name) != -1 ? 'no-active' : '') + '" data-device="' + settings[i].name + '">' + settings[i].label + '</a>';
        }

        return '<div class="title">' + this.config.label + '</div>' +
                '<div class="visible-block btn-group">' + devices_elem + '</div>' +
                '<input type="hidden" name="' + this.config.name + '" value="' + devices + '">';
    },
    /**
     * Render filed devices
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "settings" : this.config.settings,
            "devices" : this.getValue(),
            "label" : this.config.label,
            "name" : this.config.name
        }
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});