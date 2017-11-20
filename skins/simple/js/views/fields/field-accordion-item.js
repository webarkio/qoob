/*global FieldAccordionItemSettings */
/**
 * Create accordion item view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */

var FieldAccordionItem = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    className: "field-accordion-item",
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
     * @class FieldAccordionItem
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        var self = this;
        this.name = options.name;
        this.model = options.model;
        this.storage = options.storage;
        this.settings = options.settings;
        this.defaults = options.defaults;
        this.controller = options.controller;
        this.parent = options.parent;
        this.side = options.side;


        this.listenTo(this.model, 'change', function() {
            var image = self.controller.layout.viewPort.getIframeUrl(this.model.get('image'));

            this.$el.find(".title-item").first().html(this.model.get('title'));
            if (this.model.get('image') != '') {
                if (!this.$el.find(".preview-image").is(':visible')) {
                    this.$el.find(".preview-image").show();
                }                

                this.$el.find(".preview-image img").first().prop('src', image);
                
            } else {
                this.$el.find(".preview-image").hide();
            }
        });
    },
    /**
     * @param {Object} evt
     */
    showSettings: function(evt) {
        var itemId = this.model.id;

        var baseUrl = this.controller.currentUrl();

        var hash = baseUrl.split('/');
        var lastHash = hash[hash.length - 1].split('-');

        var field = _.findWhere(this.parent.parent.settings, { name: lastHash[0] });

        if (lastHash.length > 0 && ((lastHash[0] == this.parent.settings.name) || (field && field.type == "accordion"))) {
            baseUrl = hash.slice(0, -1).join('/');
        }

        this.controller.navigate(
            baseUrl +
            (jQuery(evt.currentTarget).find('.inner-settings-expand').hasClass('ui-state-active') ? ("/" + this.parent.settings.name + "-" + itemId) : ""), {
                trigger: false,
                replace: true
            });

        if (jQuery(evt.currentTarget).find('.inner-settings-expand').hasClass('ui-state-active')) {
            this.controller.layout.menu.currentView = this.settingsView;
        }

        return true;
    },
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function() {
        var image = this.controller.layout.viewPort.getIframeUrl(this.model.get('image'));

        var htmldata = {
            "image": image,
            "title": this.model.get('title'),
        };

        var item = (_.template(this.storage.getSkinTemplate('field-accordion-item-expand-preview'))(htmldata));
        this.$el.html(item);

        this.settingsView = new FieldAccordionItemSettings({
            name: this.name,
            model: this.model,
            settings: this.settings,
            storage: this.storage,
            defaults: this.defaults,
            controller: this.controller,
            parent: this.parent,
            side: this.side
        });

        this.$el.find('.settings-blocks').html(this.settingsView.render().el);

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