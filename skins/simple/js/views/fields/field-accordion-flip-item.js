var FieldAccordionFlipItem = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    className: "field-accordion-item field-accordion-flip-item",
    events: {
        'click': 'showSettings',
    },
    attributes: function() {
        return {
            'data-model-id': this.model.id
        };
    },
    /**
     * View field accordion item
     * needed for field accordion
     * @class FieldAccordionFlipItem
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.name = options.name;
        this.model = options.model;
        this.storage = options.storage;
        this.settings = options.settings;
        this.defaults = options.defaults;
        this.controller = options.controller;
        this.parent = options.parent;
        this.side = options.side;

        this.model.on("delete_model", this.deleteModel.bind(this));

        // change preview accordion item
        this.listenTo(this.model, 'change', function() {
            this.$el.find(".title-item").first().html(this.model.get('title'));
            if (this.model.get('image') != '') {
                if (this.$el.find(".preview-image").is(':visible')) {
                    this.$el.find(".preview-image").show();
                }
                this.$el.find(".preview-image img").first().prop('src', this.model.get('image'));
                
            } else {
                this.$el.find(".preview-image").hide();
            }
        });
    },
    /**
     * Show accordion item's settings
     */
    showSettings: function() {
        var itemId = this.model.id;
        this.controller.navigate(this.controller.currentUrl() + "/" + this.parent.settings.name + "-" + itemId, true);
    },
    /**
     * Render field accordion_item
     * @returns {Object}
     */
    render: function() {
        var htmldata = {
            "image": this.model.get('image'),
            "title": this.model.get('title'),
        };

        var item = (_.template(this.storage.getSkinTemplate('field-accordion-item-flip-preview'))(htmldata));
        this.$el.html(item);

        return this;
    },
    /**
     * Removes the view from the DOM and unbinds all events.
     */
    deleteModel: function() {
        this.model.stopListening();
        this.model.trigger('destroy', this.model, this.model.collection);
        this.remove();
        this.model.trigger('remove_item');
    }
});