var Fields = Fields || {};
Fields.accordion_item_flip = Backbone.View.extend(
/** @lends Fields.accordion_item_front.prototype */{
    className: "settings-item settings-accordion",
    accordionItemFrontTpl : null,
    accordionItemFrontSettingTpl : null,
    events: {
        'click .cross-delete': 'deleteModel',
        'click .title_accordion.inner-settings-flip' : 'showSettings',
    },
    /**
     * View field accordion item
     * needed for field accordion
     * @class Fields.image
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.$el.attr('data-model-id', this.model.id);

        var self = this;
        builder.storage.getBuilderTemplate('field-accordion-item-flip', function(err, data){
            self.accordionItemFrontTpl = _.template(data);
        });

        builder.storage.getBuilderTemplate('field-accordion-item-flip-setting', function(err, data){
            self.accordionItemFrontSettingTpl = _.template(data);
        });
    },

    /**
     * Show accordion item's settings
     * @returns {Object}
     */
    showSettings: function (evt) {
        var blockId;

        var settingsView = new FieldsView({model: this.model});
        settingsView.config = this.config;
        
        var flipView = new AccordionFlipView({"model" : this.model, "parentId" : this.model.owner_id});

        flipView.$el.append(settingsView.render().el);
        builder.builderLayout.menu.addView(flipView, 270);
        builder.builderLayout.menu.rotate(flipView.$el.prop('id'));
        builder.builderLayout.menu.settingsViewStorage[flipView.$el.prop('id')] = flipView;
    },
    
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function () {
        var items = [];
        var settingsView = new FieldsView({model: this.model});
        var htmldata = {
            "image" : settingsView.model.get('image'),
            "title" : settingsView.model.get('title'),
        }
        // change preview accordion item
        this.listenTo(settingsView.model, 'change', function (){
            this.$el.find("h3 span.text").html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
        });

        items.push(this.accordionItemFrontTpl( htmldata ));

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

