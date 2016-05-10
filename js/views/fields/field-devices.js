var Fields = Fields || {};
Fields.devices = Backbone.View.extend(
/** @lends Fields.devices.prototype */{
    className: "settings-item",
    events: {
        'click .btn-group a': 'clickDevice'
    },
    /**
     * View field devices
     * @class Fields.devices
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.controller = options.controller;
        this.storage = options.storage;
        this.settings = options.settings;
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
        
        this.controller.layout.viewPort.visibilityBlocks(this.model.id, active);
    },
    /**
     * Get value field devices
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
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
        };
        
        this.$el.html(_.template(this.storage.builderTemplates['field-devices'])(htmldata));
        return this;
    }
});