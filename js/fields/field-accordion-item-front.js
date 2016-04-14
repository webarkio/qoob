var Fields = Fields || {};
Fields.accordion_item_front = Backbone.View.extend(
/** @lends Fields.accordion_item_front.prototype */{
    className: "settings-item settings-accordion",
    frontsettings: '',
    accordion_item_frontTpl : null,
    accordion_item_front_settingTpl : null,
    events: {
        'click .cross-delete': 'deleteModel',
        'click .title_accordion.inner-settings-true' : 'showSettings',
    },
    /**
     * View field accordion item
     * needed for field accordion
     * @class Fields.image
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.frontsettings = options.frontsettings;
        this.$el.attr('data-model-id', this.model.id);
        this.accordion_item_frontTpl = _.template(builder.storage.getFieldTemplate('field-accordion-item-front'));
        this.accordion_item_front_settingTpl = _.template(builder.storage.getFieldTemplate('field-accordion-item-front-setting'));
    },

    /**
     * Show accordion item's settings
     * @returns {Object}
     */
    
    showSettings: function (evt) {
        var blockId = jQuery(evt.target).closest('.settings.menu-block').attr('id').match(new RegExp(/(\d)+/))[0];

        var htmldata = {
            "blockId" : blockId,
        }

        builder.menu.showInnerSettings(blockId, this.accordion_item_front_settingTpl( htmldata ));
        var settingsView = new SettingsView({model: this.model});
        settingsView.config = this.config;
        
        jQuery('#inner-settings-accordion').append(settingsView.render().el);
    },
    
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function () {
        var items = [];
        var settingsView = new SettingsView({model: this.model});
        var htmldata = {
            "frontsettings" : (this.frontsettings === undefined) ? "false" : this.frontsettings,
            "image" : settingsView.model.get('image'),
            "title" : settingsView.model.get('title'),
        }
        // change preview accordion item
        this.listenTo(settingsView.model, 'change', function (){
            this.$el.find("h3 span.text").html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
        });

        items.push(this.accordion_item_frontTpl( htmldata ));

        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(items);
        }
        return this;
    },
    /**
     * Removes the view from the DOM and unbinds all events.
     * @param {Object} e
     */
    deleteModel: function (e) {
        e.preventDefault();
        this.model.stopListening();
        this.model.trigger('destroy', this.model, this.model.collection);
        this.remove();
        this.model.trigger('change');
    }
});

