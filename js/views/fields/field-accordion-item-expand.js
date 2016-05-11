var Fields = Fields || {};
Fields.accordion_item_expand = Backbone.View.extend(
        /** @lends Fields.accordion_item.prototype */{
            className: "settings-item settings-accordion",
            accordionItemTpl: null,
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
                this.model = options.model;
                this.settings = options.settings;
                this.storage = options.storage;
                this.controller = options.controller;
                this.$el.attr('data-model-id', this.model.id);
                this.tpl = _.template(this.storage.builderTemplates['field-accordion-item-expand']);
            },
            /**
             * Render filed accordion_item
             * @returns {Object}
             */
            render: function () {
                var items = [],
                        settingsView = new FieldsView({
                            model: this.model,
                            settings: this.settings,
                            storage: this.storage,
                            controller: this.controller
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
            deleteModel: function (e) {
                e.preventDefault();
                this.model.stopListening();
                this.model.trigger('destroy', this.model, this.model.collection);
                this.remove();
                this.model.trigger('change');
            }
        });