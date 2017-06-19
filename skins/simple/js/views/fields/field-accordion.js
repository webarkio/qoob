var Fields = Fields || {};
Fields.accordion = QoobFieldView.extend(
    /** @lends Fields.accordion.prototype */
    {
        uniqueId: null,
        classNameItem: "",
        accordionMenuViews: [],
        parentId: null,
        events: {
            'drop .accordion': 'changePosition'
        },
        /**
         * View field accordion
         * @class Fields.accordion
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.tpl = _.template(this.storage.getSkinTemplate('field-accordion-preview'));
            this.parentId = options.parentId || this.model.id;
        },
        /**
         * On accordion remove deleting binded events 
         * and triggering basic remove funcction
         * 
         */
        remove: function() {
            this.$el.find('#' + this.uniqueId).next('.add-block').off("click", this.addNewItem);
            Backbone.View.prototype.remove.apply(this, arguments);
        },
        removeItem: function() {
            var values = this.getValue();
            values.trigger('change');
            this.changePosition();
        },
        /**
         * Change position blocks accordion
         * @param {Object} event
         * @param {integer} position
         */
        changePosition: function(event, position) {
            var self = this,
                values = this.getValue(),
                blocks = this.$el.find('#' + this.getUniqueId()).children('.settings-accordion');

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

            for (var i = 0; i < settingsParams.length; i++) {
                data[settingsParams[i].name] = settingsParams[i].default;
            }

            newModel = QoobUtils.createModel(data);
            newModel.owner_id = this.model.id;
            values.add(newModel);
            values.listenTo(newModel, 'change', function() {
                this.trigger('change', this);
            });
            newModel.on("remove_item", this.removeItem.bind(this));
            var item = new Fields[this.classNameItem]({
                model: newModel,
                settings: settings,
                storage: this.storage,
                defaults: defaults,
                controller: this.controller,
                parentId: this.parentId
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
                settings = this.settings.settings,
                items = [];
            // sort accordion settings
            values.models = _.sortBy(values.models, function(model) {
                return model.get('order');
            });

            this.classNameItem = (this.settings.viewType === undefined || this.settings.viewType === "expand") ? 'accordion_item_expand' : 'accordion_item_flip';
            if (values.length && values.length > 0) {
                for (var i = 0; i < values.models.length; i++) {
                    var item = new Fields[this.classNameItem]({
                        model: values.models[i],
                        settings: settings,
                        defaults: this.defaults[i] || this.defaults[0],
                        storage: this.storage,
                        controller: this.controller,
                        parentId: this.parentId
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
                "settings": settings,
                'add_component': this.storage.__('add_component', 'Add component'),
                'drag_to_delete': this.storage.__('drag_to_delete', 'Drag to delete')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata)).find('#' + this.getUniqueId()).append(items);
                this.sortableInit();
            }
            // AddNewItem func on clicking button
            // we added this handler dynamiclly to prevent bubbling it to inner accordions
            this.$el.find('#' + this.uniqueId).next('.add-block').on('click', this.addNewItem.bind(this));

            return this;
        },
        sortableInit: function() {
            var self = this,
                id = this.getUniqueId();

            this.$el.find("#" + id).accordion({
                header: "> div > h3.inner-settings-expand",
                animate: 500,
                collapsible: true,
                active: false,
                heightStyle: 'content'
            }).sortable({
                items: ".settings-accordion",
                revert: false,
                axis: "y",
                helper: 'clone',
                handle: ".drag-elem",
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
