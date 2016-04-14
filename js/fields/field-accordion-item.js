var Fields = Fields || {};
Fields.accordion_item = Backbone.View.extend(
/** @lends Fields.accordion_item.prototype */{
    className: "settings-item settings-accordion",
    frontsettings: '',
    accordion_itemTpl : null,
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
    initialize: function (options) {
        this.frontsettings = options.frontsettings;
        this.$el.attr('data-model-id', this.model.id);
        this.accordion_itemTpl = _.template(builder.storage.getFieldTemplate('field-accordion-item'));
    },
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function () {
        var items = [];
        var settingsView = new SettingsView({model: this.model});
        settingsView.config = this.config;

        var htmldata = {
            "frontsettings" : (this.frontsettings === undefined) ? "false" : this.frontsettings,
            "image" : settingsView.model.get('image'),
            "title" : settingsView.model.get('title'),
        }
        
        this.listenTo(settingsView.model, 'change', function (){
            this.$el.find("h3 span.text").html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
        });
        
        items.push(this.accordion_itemTpl( htmldata ));
        items.push(settingsView.render().el);

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