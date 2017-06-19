var Fields = Fields || {};
Fields.accordion_item_expand = Backbone.View.extend(
/** @lends Fields.accordion_item.prototype */{
    className: "settings-item settings-accordion",
    events: {
        'click .cross-delete': 'deleteModel'
    },
    parentId: null,
    /**
     * View field accordion item
     * needed for field accordion
     * @class Fields.image
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        QoobFieldView.prototype.initialize.call(this, options);
        this.$el.attr('data-model-id', this.model.id);
        this.tpl = _.template(this.storage.getSkinTemplate('field-accordion-item-expand-preview'));
        this.parentId = options.parentId || this.model.owner_id;
    },
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function () {
        var items = [],
                settingsView = new QoobFieldsView({
                    model: this.model,
                    settings: this.settings,
                    defaults: this.defaults,
                    storage: this.storage,
                    controller: this.controller,
                    parentId: this.parentId
                }),
                htmldata = {
                    "image": settingsView.model.get('image'),
                    "title": settingsView.model.get('title')
                };
        this.listenTo(this.model, 'change', function () {
            this.$el.find("h3 span.text").first().html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").first().prop('src', this.model.get('image'));
        });

        items.push(this.tpl(htmldata));
        items.push(settingsView.render().$el.append('<div class="cross-delete expand"></div>'));

        if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
            this.$el.html(items);
        }
        return this;
    },
    /**
     * Removes the view from the DOM and unbinds all events.
     * @param {Object} e
     */
    deleteModel: function () {
        this.model.stopListening();
        this.model.trigger('destroy', this.model, this.model.collection);
        this.remove();
        this.model.trigger('remove_item');
    }
});