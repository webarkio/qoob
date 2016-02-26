var Fields = Fields || {};
Fields.accordion_item = Backbone.View.extend(
/** @lends Fields.accordion_item.prototype */{
    className: "settings-item settings-accordion",
    events: {
        'click .cross-delete': 'deleteModel'
    },
    /**
     * View field accordion item
     * needed for field accordion
     * @class Fields.image
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
        this.$el.attr('data-model-id', this.model.id);
    },
    /**
     * Create filed accordion_item
     * @returns {String}
     */
    create: function () {
        var items = [];
        var settingsView = new SettingsView({model: this.model});
        settingsView.config = this.config;
        
        // change preview accordion item
        this.listenTo(settingsView.model, 'change', function (){
            this.$el.find("h3 span.text").html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
        });
        items.push('<h3 class="title title_accordion">' +
                (settingsView.model.get('image')!= undefined ? '<span class="preview_img"><img src="'+ settingsView.model.get('image') +'" /></span>' : '') +
                '<span class="text">' + settingsView.model.get('title') + '</span><span class="drag-elem"></span>' +
                '<span class="cross-delete"><a href="#"></a></span></h3>');
        items.push(settingsView.render().el);
        
        return items;
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