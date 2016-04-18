var Fields = Fields || {};
Fields.accordion_item_expand = Backbone.View.extend(
/** @lends Fields.accordion_item.prototype */{
    className: "settings-item settings-accordion",
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
    initialize: function () {
        this.$el.attr('data-model-id', this.model.id);
        this.accordion_itemTpl = _.template(builder.storage.getFieldTemplate('field-accordion-item-expand'));
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
            "image" : settingsView.model.get('image'),
            "title" : settingsView.model.get('title')
        };
        
        this.listenTo(this.model, 'change', function (){
            this.$el.find("h3 span.text").first().html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").first().prop('src', this.model.get('image'));
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