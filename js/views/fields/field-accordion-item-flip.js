var Fields = Fields || {};
Fields.accordion_item_flip = Backbone.View.extend(
        /** @lends Fields.accordion_item_front.prototype */{
            className: "settings-item settings-accordion",
            tpl: null,
            events: {
                // 'click .cross-delete': 'deleteModel',
                'click .title_accordion.inner-settings-flip': 'showSettings',
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
                this.storage = options.storage;
                this.settings = options.settings;
                this.controller = options.controller;
                this.$el.attr('data-model-id', this.model.id);
                this.tpl = _.template(this.storage.builderTemplates['field-accordion-item-flip-preview']);
                this.parentId = options.parentId || this.model.owner_id;
                this.model.on("delete_model", this.deleteModel.bind(this));
            },
            /**
             * Show accordion item's settings
             * @returns {Object}
             */
            showSettings: function (evt) {
                var flipView = new AccordionFlipView({
                    model: this.model,
                    settings: this.settings,
                    storage: this.storage,
                    controller: this.controller,
                    parentId: this.parentId
                });
                this.controller.setInnerSettingsView(flipView);
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
                            "title": settingsView.model.get('title'),
                        };
                // change preview accordion item
                this.listenTo(settingsView.model, 'change', function () {
                    this.$el.find("h3 span.text").html(this.model.get('title'));
                    this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
                });

                items.push(this.tpl(htmldata));

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
                this.model.trigger('change');
            }
        });

