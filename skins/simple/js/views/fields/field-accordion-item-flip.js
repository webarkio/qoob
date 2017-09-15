/*global QoobFieldView, QoobFieldsView, AccordionFlipView */
var Fields = Fields || {};
Fields.accordion_item_flip = QoobFieldView.extend( 
        /** @lends Fields.accordion_item_front.prototype */{
            className: "field-accordion__settings",
            events: {
                'click': 'showSettings',
            },
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
                this.tpl = _.template(this.storage.getSkinTemplate('field-accordion-item-flip-preview'));
                this.parentId = options.parentId || this.model.owner_id;
                this.model.on("delete_model", this.deleteModel.bind(this));
            },
            /**
             * Show accordion item's settings
             * @param {Object} event
             * @returns {Object}
             */
            showSettings: function (evt) {
                console.log('showSettings');
                var flipView = new AccordionFlipView({
                    model: this.model,
                    settings: this.settings.settings,
                    defaults: this.defaults,
                    storage: this.storage,
                    controller: this.controller,
                    parentId: this.parentId
                });
                this.controller.setInnerSettingsView(flipView);

                var itemId = jQuery(evt.currentTarget).index() - 1;


                // console.log(Backbone.history.fragment + '/' + this.settings.name + '/' + itemId);

                // console.log(Backbone.history.getFragment());


                // this.controller.history.push(Backbone.history.fragment + '/' + this.settings.name + '/' + itemId);

                // if (Backbone.history.getFragment() === (Backbone.history.fragment + '/' + this.settings.name + '/' + itemId)) {
                //     console.log('tttttt');
                // }

                // console.log(Backbone.history.getFragment());
                // console.log(Backbone.history.getFragment() + '/' + this.settings.name + '/' + itemId);
                
                this.controller.navigate(Backbone.history.getFragment() + '/' + this.settings.name + '-' + this.model.id, {
                    trigger: false
                });
                
            },
            /**
             * Render field accordion_item
             * @returns {Object}
             */
            render: function () {
                var items = [],
                        settingsView = new QoobFieldsView({
                            model: this.model,
                            settings: this.settings.settings,
                            defaults: this.defaults,
                            storage: this.storage,
                            controller: this.controller
                        }),
                        htmldata = {
                            "image": settingsView.model.get('image'),
                            "title": settingsView.model.get('title'),
                        };
                // change preview accordion item
                this.listenTo(settingsView.model, 'change', function () {
                    this.$el.find(".title-item").first().html(this.model.get('title'));
                    this.$el.find(".preview-image img").first().prop('src', this.model.get('image'));
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
                this.model.trigger('remove_item');
            }
        });

