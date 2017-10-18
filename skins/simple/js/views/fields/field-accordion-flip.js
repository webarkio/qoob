/* global QoobFieldView, FieldAccordionFlipItem, QoobUtils */
var Fields = Fields || {};
Fields.accordion_flip = QoobFieldView.extend(
    /** @lends Fields.accordion.prototype */
    {
        className: 'field-accordion field-group',
        uniqueId: null,
        classNameItem: "",
        accordionMenuViews: [],
        events: {
            'drop .accordion': 'changePosition'
        },
        /**
         * View field accordion
         * @class Fields.accordion_flip
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.tpl = _.template(this.storage.getSkinTemplate('field-accordion-preview'));
        },
        /**
         * On accordion remove deleting binded events 
         * and triggering basic remove funcction
         * 
         */
        remove: function() {
            this.$el.find('#' + this.uniqueId).parent().find('.add-item').off("click", this.addNewItem);
            Backbone.View.prototype.remove.apply(this, arguments);
        },
        removeItem: function() {
            var values = this.getValue();
            values.trigger('change');
            this.changePosition();
        },
        /**
         * Change position blocks accordion
         */
        changePosition: function() {
            var self = this,
                values = this.getValue(),
                blocks = this.$el.find('#' + this.getUniqueId()).children('.field-accordion-item');

            blocks.each(function(index, listItem) {
                var dataId = self.$(listItem).data('model-id'),
                    model = values.get(dataId);

                if (model) {
                    model.set('order', self.$(listItem).index() - 1);
                }
            });
        },
        /**
         * Get unique id
         * @returns {String}
         */
        getUniqueId: function() {
            return this.uniqueId = this.uniqueId || _.uniqueId('accordion-');
        },
        /**
         * Add new item to accordion
         * @param {Object} e
         */
        addNewItem: function(e) {
            e.preventDefault();
            var values = this.getValue(),
                settings = this.settings.settings,
                defaults = this.defaults[0],
                settingsParams = [],
                data = [],
                newModel;

            for (var i = 0; i < settings.length; i++) {
                settingsParams.push({ 'name': settings[i].name, 'default': defaults[settings[i].name] });
            }

            for (var y = 0; y < settingsParams.length; y++) {
                data[settingsParams[y].name] = settingsParams[y].default;
            }

            newModel = QoobUtils.createModel(data);
            newModel.owner_id = this.model.id;
            values.add(newModel);
            values.listenTo(newModel, 'change', function() {
                this.trigger('change', this);
            });
            newModel.on("remove_item", this.removeItem.bind(this));
            var item = new FieldAccordionFlipItem({
                name: this.name + '_' + newModel.id,
                model: newModel,
                settings: settings,
                defaults: defaults,
                storage: this.storage,
                controller: this.controller,
                parent: this,
                side: this.side
            });
            item.model.set('order', (values.models ? values.models.length - 1 : 0));

            this.accordionMenuViews.push(item);

            this.$el.find("#" + this.getUniqueId()).append(item.render().el);
            this.$el.find("#" + this.getUniqueId()).accordion("refresh");
            values.trigger('change');
        },
        /**
         * Render filed accordion
         * @returns {Object}
         */
        render: function() {
            var values = this.getValue(),
                items = [];
            // sort accordion settings
            values.models = _.sortBy(values.models, function(model) {
                return model.get('order');
            });

            if (values.length && values.length > 0) {
                for (var i = 0; i < values.models.length; i++) {
                    var item = new FieldAccordionFlipItem({
                        name: this.name + '_' + values.models[i].id,
                        model: values.models[i],
                        settings: this.settings.settings,
                        defaults: this.defaults[i] || this.defaults[0],
                        storage: this.storage,
                        controller: this.controller,
                        parent: this,
                        side: this.side
                    });

                    this.accordionMenuViews.push(item);
                    items.push(item.render().el);

                    // listen trigger when remove item
                    values.models[i].on("remove_item", this.removeItem.bind(this));
                }
            }

            var htmldata = {
                "label": this.settings.label,
                "uniqueId": this.getUniqueId(),
                "settings": this.settings.settings,
                'add_new_tab': this.storage.__('add_new_tab', 'Add a new item'),
                'Delete': this.storage.__('delete', 'Delete')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata)).find('#' + this.getUniqueId()).append(items);
                this.sortableInit();
            }
            // AddNewItem func on clicking button
            // we added this handler dynamiclly to prevent bubbling it to inner accordions
            this.$el.find('#' + this.uniqueId).parent().find('.add-item').on('click', this.addNewItem.bind(this));

            return this;
        },
        sortableInit: function() {
            var self = this,
                id = this.getUniqueId();

            this.$el.find("#" + id).accordion({
                header: "> div > h3.inner-settings-flip",
                animate: 500,
                collapsible: true,
                active: false,
                heightStyle: 'content'
            }).sortable({
                items: ".field-accordion-flip-item",
                revert: false,
                axis: "y",
                helper: 'clone',
                handle: ".draggable",
                connectWith: "#drop-" + id,
                scope: "accordion",
                start: function() {
                    self.controller.layout.viewPort.getIframeContents().find(".droppable").css("visibility", "hidden");
                    jQuery(this).addClass('is-droppable');
                },
                stop: function(event, ui) {
                    jQuery(this).removeClass('is-droppable');
                    ui.item.trigger("drop", ui.item.index());
                    // IE doesn't register the blur when sorting
                    // so trigger focusout handlers to remove .ui-state-focus
                    ui.item.children("h3").triggerHandler("focusout");
                    // Refresh accordion to handle new order
                    self.$(this).accordion("refresh");
                    self.controller.layout.viewPort.getIframeContents().find(".droppable").removeAttr("style");
                }
            });

            this.$el.find("#drop-" + id).droppable({
                scope: "accordion",
                hoverClass: "ui-state-hover",
                drop: function(event, ui) {
                    var modelId = ui.draggable.data('model-id');
                    var model = self.getAccordionMenuViews(modelId);
                    model.deleteModel();
                }
            });
        },
        /**
         * Get sccordionMenuViews by id
         * @param {Number} id modelId
         */
        getAccordionMenuViews: function(id) {
            for (var i = 0; i < this.accordionMenuViews.length; i++) {
                if (this.accordionMenuViews[i].model && this.accordionMenuViews[i].model.id == id) {
                    return this.accordionMenuViews[i];
                }
            }
        }
    });