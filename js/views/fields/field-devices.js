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
    },
    /**
     * Devices settings
     * @returns object field devices
     */
    settings: function () {
        return {
            "name": "devices",
            "label": "Visible Devices",
            "type": "devices",
            "settings": [{
                "name": "desktop",
                "label": "Desktop"
            }, {
                "name": "tablet",
                "label": "Tablet"
            }, {
                "name": "mobile",
                "label": "Mobile"
            }],
            "default": ""
        }
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    clickDevice: function (evt) {
        evt.preventDefault();
        var target = jQuery(evt.currentTarget);
        target.toggleClass('no-active');

        var input = this.$el.find('input[name="'+this.settings().name+'"]');        
        var devices = this.$el.find('.btn-group a');
        
        var active = [];
        for (var i = 0; i < devices.length; i++) {
            if (jQuery(devices[i]).hasClass('no-active')) {
                active.push(jQuery(devices[i]).data('device'));
            }
        }

        input.val(active);
        this.model.set(this.settings().name, active.join(','));
        
        this.controller.layout.viewPort.visibilityBlocks(this.model.id, active);
    },
    /**
     * Get value field devices
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.settings().name) || this.settings().default;
    },
    /**
     * Render filed devices
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "settings" : this.settings().settings,
            "devices" : this.getValue(),
            "label" : this.settings().label,
            "name" : this.settings().name
        };

        this.$el.html(_.template(this.storage.builderTemplates['field-devices-preview'])(htmldata));
        return this;
    }
});