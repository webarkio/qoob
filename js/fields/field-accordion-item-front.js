var Fields = Fields || {};
Fields.accordion_item_front = Backbone.View.extend(
/** @lends Fields.accordion_item_front.prototype */{
    className: "settings-item settings-accordion",
    frontsettings: '',
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
    },
    /**
     * Create filed accordion_item
     * @returns {String}
     */
    create: function () {
        var frontsettings = (this.frontsettings === undefined) ? "false" : this.frontsettings;
        var items = [];
        var settingsView = new SettingsView({model: this.model});

        // change preview accordion item
        this.listenTo(settingsView.model, 'change', function (){
            this.$el.find("h3 span.text").html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
        });
        items.push('<h3 class="title title_accordion inner-settings-'+ frontsettings +'">' +
                (settingsView.model.get('image')!== undefined ? '<span class="preview_img"><img src="'+ settingsView.model.get('image') +'" /></span>' : '') +
                '<span class="text">' + settingsView.model.get('title') + '</span><span class="drag-elem"></span>' +
                '<span class="cross-delete"><a href="#"></a></span></h3>');
        //items.push(settingsView.render().el);
       
        return items;
    },
    
    /**
     * Show accordion item's settings
     * @returns {Object}
     */
    
    showSettings: function (evt) {
        var blockId = jQuery(evt.target).closest('.settings.menu-block').attr('id').match(new RegExp(/(\d)+/))[0];
        var markup = '<div id="inner-settings-accordion" class="inner-settings">\
                            <div class="backward"><a onclick=" builder.menu.showSettings('+ blockId +'); return false;" href="#">Back</a></div>\
                      </div>';    
        
        builder.menu.showInnerSettings(blockId, markup);
        var settingsView = new SettingsView({model: this.model});
        settingsView.config = this.config;
        
        jQuery('#inner-settings-accordion').append(settingsView.render().el);
    },
    
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
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

