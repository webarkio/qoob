var Fields = Fields || {};
Fields.devices = FieldView.extend(
/** @lends Fields.devices.prototype */{
    events: {
        'click .btn-group a': 'clickDevice'
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    clickDevice: function (evt) {
        evt.preventDefault();
        var target = jQuery(evt.currentTarget);
        target.toggleClass('no-active');

        var input = this.$el.find('input[name="'+this.settings.name+'"]');        
        var devices = this.$el.find('.btn-group a');
        
        var active = [];
        for (var i = 0; i < devices.length; i++) {
            if (jQuery(devices[i]).hasClass('no-active')) {
                active.push(jQuery(devices[i]).data('device'));
            }
        }

        input.val(active);
        this.model.set(this.settings.name, active.join(','));
        
        this.controller.layout.viewPort.visibilityBlocks(this.model.id, active);
    },
    /**
     * Render filed devices
     * @returns {Object}
     */
    render: function () {
        var htmldata = {
            "settings" : this.settings.settings,
            "devices" : this.getValue(),
            "label" : this.settings.label,
            "name" : this.settings.name
        };
        
        this.$el.html(_.template(this.storage.builderTemplates['field-devices-preview'])(htmldata));
        return this;
    }
});