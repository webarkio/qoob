/*global FieldAccordionItemSettings */
/**
 * Create accordion item view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */

var FieldAccordionItem = Backbone.View.extend( // eslint-disable-line no-unused-vars
    {
        className: "field-accordion-item",
        events: {
            'click .inner-settings-expand': 'showSettings',
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
            this.name = options.name;
            this.model = options.model;
            this.storage = options.storage;
            this.settings = options.settings;
            this.defaults = options.defaults;
            this.controller = options.controller;
            this.parent = options.parent;
            this.side = options.side;
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
                (jQuery(evt.currentTarget).hasClass('ui-state-active') ? ("/" + this.parent.settings.name + "-" + itemId) : ""), {
                    trigger: true,
                    replace: true
                });

            return true;
        },
        /**
         * Render filed accordion_item
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                "image": this.model.get('image'),
                "title": this.model.get('title')
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

            this.$el.find('.settings-blocks').html(this.settingsView.getHtml());

            this.listenTo(this.model, 'change', function() {
                this.$el.find(".title-item").first().html(this.model.get('title'));
                this.$el.find(".preview-image img").first().prop('src', this.model.get('image'));
            });

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