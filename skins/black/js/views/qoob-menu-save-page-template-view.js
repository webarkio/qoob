/*global QoobUtils, QoobFieldsView*/
/**
 * Create view save template
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuSavePageTemplateView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuSavePageTemplateView.prototype */
    {
        events: {
            'click .create-template': 'clickCreateTemplate'
        },
        settingsModel: null,
        config: [{
            "name": "title",
            "label": "Title",
            "type": "text",
            "placeholder": "Enter name template"
        }, {
            "name": "image",
            "label": "Image",
            "type": "image"
        }],
        defaults: {
            "title": "",
            "image": ""
        },
        id: "save-template",
        attributes: function() {
            return {
                'class': "save-template settings",
                'data-side-id': "save-template"
            };
        },
        /**
         * View settings
         * @class QoobMenuSavePageTemplateView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
        },
        clickCreateTemplate: function(evt) {
            evt.preventDefault();
            var self = this;
            var elem = this.$(evt.currentTarget);

            var sorted = _.sortBy(this.storage.pageTemplatesCollection.models, function(obj) {
                return obj.id;
            });

            var newId = sorted.length ? sorted[sorted.length - 1].id + 1 : 1;

            var dataView = {
                'id': newId,
                'title': this.settingsModel.get('title'),
                'image': this.settingsModel.get('image')
            };

            elem.addClass('active');
            this.controller.createPageTemplate(dataView, function(error) {
                elem.removeClass('active');
                if (error === null) {
                    self.$el.find('.save-template-settings').addClass('show-notice');
                    self.$el.find('.save-template-settings .error-block').hide();
                    self.settingsModel.set('image', '');
                    self.settingsModel.set('title', '');
                    self.$el.find('.input-text').removeClass('error');
                } else {
                    if (error.title) {
                        self.$el.find('.input-text').addClass('error');
                    }
                    if (error.blocks) {
                        self.$el.find('.save-template-settings .error-block').show();
                    }

                }
            });
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            var model = QoobUtils.createModel(this.config);

            var data = {
                'back': this.storage.__('back', 'Back'),
                'save_template': this.storage.__('save_template', 'Save template'),
                'save_loading': this.storage.__('save_process', 'Save...'),
                'save_notice_title': this.storage.__('save_notice_title', 'Your template has been saved successfully!'),
                'save_notice_text': this.storage.__('save_notice_text', 'You can use a ready-made template to create a new page.'),
                'you_cant_save_empty_template': this.storage.__('you_cant_save_empty_template', "You can't save empty template")
            };

            this.settingsView = new QoobFieldsView({
                model: model,
                settings: this.config,
                defaults: this.defaults,
                storage: this.storage,
                controller: this.controller,
                parentId: this.id
            });

            this.settingsModel = this.settingsView.model;

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-more-preview'))(data)).find('.settings-blocks-full').prepend(this.settingsView.render().el);

            this.afterRender();

            return this;
        },
        afterRender: function() {
            var self = this,
                counter = 0,
                fields = this.settingsView.fields;

            this.$el.on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                })
                .on('dragenter', function() {
                    counter++;
                    if (counter === 1) {
                        for (var i = 0; i < fields.length; i++) {
                            fields[i].$el.trigger('global_drag_start');
                        }
                        self.$el.addClass('overlay');
                    }
                })
                .on('dragleave', function() {
                    counter--;
                    if (counter === 0) {
                        for (var i = 0; i < fields.length; i++) {
                            fields[i].$el.trigger('global_drag_stop');
                        }
                        self.$el.removeClass('overlay');
                    }
                })
                .on('drop', function() {
                    for (var i = 0; i < fields.length; i++) {
                        fields[i].$el.trigger('global_drag_stop');
                    }
                    self.$el.removeClass('overlay');
                    counter = 0;
                });
        },
    });
