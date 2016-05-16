var Fields = Fields || {};
Fields.accordion = Backbone.View.extend(
        /** @lends Fields.accordion.prototype */{
            className: "settings-item",
            uniqueId: null,
            tpl: null,
            classNameItem: "",
            events: {
                'click .add-block': 'addNewItem',
                'drop': 'changePosition'
            },
            /**
             * View field accordion
             * @class Fields.accordion
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                this.model = options.model;
                this.settings = options.settings;
                this.storage = options.storage;
                this.controller = options.controller;
                this.tpl = _.template(this.storage.builderTemplates['field-accordion-preview']);
            },
            /**
             * Change position blocks accordion
             * @param {Object} event
             * @param {integer} position
             */
            changePosition: function (event, position) {
                var self = this,
                        values = this.getValue(),
                        blocks = this.$el.find('#' + this.getUniqueId()).children('.settings-accordion');

                blocks.each(function (index, listItem) {
                    var dataId = self.$(listItem).data('model-id'),
                            model = values.get(dataId);
                    model.set('order', self.$(listItem).index() - 1);
                });
            },
            /**
             * Get value field accordion
             * @returns {String}
             */
            getValue: function () {
                return this.model.get(this.settings.name) || this.settings.default;
            },
            /**
             * Get unique id
             * @returns {String}
             */
            getUniqueId: function () {
                return this.uniqueId = this.uniqueId || _.uniqueId('accordion-');
            },
            /**
             * Add new item to accordion
             * @param {Object} e
             */
            addNewItem: function (e) {
                e.preventDefault();

                var self = this,
                        values = this.getValue(),
                        settings = this.settings.settings,
                        settingsParams = [],
                        data = [],
                        newModel;

                for (var i in settings) {
                    settingsParams.push({'name': settings[i].name, 'default': settings[i].default});
                }

                for (var i = 0; i < settingsParams.length; i++) {
                    data[settingsParams[i].name] = settingsParams[i].default;
                }
                newModel = BuilderUtils.createModel(data);
                values.add(newModel);
                var item = new Fields[this.classNameItem]({
                    model: newModel,
                    settings: settings,
                    storage: this.storage,
                    controller: this.controller,
                    parentId: this.model.id
                });

                item.model.set('order', (values.models ? values.models.length - 1 : 0));

                this.$el.find("#" + this.getUniqueId()).append(item.render().el);
                this.$el.find("#" + this.getUniqueId()).accordion("refresh");
                values.trigger('change');
            },
            /**
             * Render filed accordion
             * @returns {Object}
             */
            render: function () {
                var values = this.getValue(),
                        settings = this.settings.settings,
                        items = [];
                // sort accordion settings
                values.models = _.sortBy(values.models, function (model) {
                    return model.get('order');
                });
                this.classNameItem = (this.settings.viewType === undefined || this.settings.viewType === "expand") ? 'accordion_item_expand' : 'accordion_item_flip';

                for (var i = 0; i < values.models.length; i++) {
                    var item = new Fields[this.classNameItem]({
                        model: values.models[i],
                        settings: settings,
                        storage: this.storage,
                        controller: this.controller
                    });

                    items.push(item.render().el);
                }

                var htmldata = {
                    "label": this.settings.label,
                    "uniqueId": this.getUniqueId(),
                    "settings": settings
                };

                if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
                    this.$el.html(this.tpl(htmldata)).find('#' + this.getUniqueId()).append(items);
                    this.sortableInit();
                }

                return this;
            },
            sortableInit: function () {
                var self = this,
                        id = this.getUniqueId();

                this.$el.find("#" + id).accordion({
                    header: "> div > h3.inner-settings-expand",
                    animate: 500,
                    collapsible: true,
                    heightStyle: 'content',
                }).sortable({
                    items: ".settings-accordion",
                    revert: false,
                    axis: "y",
                    handle: ".drag-elem",
                    //handle: "h3",
                    //scroll: true,
                    start: function (event, ui) {
                        self.controller.layout.viewPort.getIframeContents().find(".droppable").css("visibility", "hidden");
                        if (self.$(this).find(".tinyMCE").length) {
                            self.$(this).find(".tinyMCE").each(function () {
                                try {
                                    tinymce.execCommand("mceRemoveEditor", false, self.$(this).attr("id"));
                                } catch (e) {
                                }
                            });
                        }
                    },
                    sort: function (event, ui) {
                    },
                    stop: function (event, ui) {
                        ui.item.trigger("drop", ui.item.index());
                        // IE doesn't register the blur when sorting
                        // so trigger focusout handlers to remove .ui-state-focus
                        ui.item.children("h3").triggerHandler("focusout");
                        // Refresh accordion to handle new order
                        self.$(this).accordion("refresh");
                        self.controller.layout.viewPort.getIframeContents().find(".droppable").removeAttr("style");
                        // Refresh tinyMCE
                        if (self.$(this).find(".tinyMCE").length) {
                            self.$(this).find(".tinyMCE").each(function () {
                                try {
                                    tinymce.execCommand("mceAddEditor", true, self.$(this).attr("id"));
                                } catch (e) {
                                }
                            });
                        }
                    }
                });

            }
        });