/*global QoobUtils, QoobFieldsView, html2canvas*/
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
        }],
        defaults: {
            "title": "",
            "image": ""
        },
        attributes: function() {
            return {
                'data-side-id': "save-template",
                'class': "save-template settings"
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
                'image': null
            };

            elem.addClass('active');

            this.controller.layout.viewPort.getIframeContents().scrollTop(0);

            html2canvas(this.controller.layout.viewPort.getIframeContents().find('body'), {scale: 2}).then(function(canvas) {
                var extraCanvas = document.createElement("canvas");
                extraCanvas.setAttribute('width',254);
                extraCanvas.setAttribute('height',272);
                var ctx = extraCanvas.getContext('2d');
                ctx.drawImage(canvas,0,0,canvas.width, canvas.height,0,0,254,272);
                var dataURL = extraCanvas.toDataURL();
                dataView['image'] = dataURL;

                self.controller.createPageTemplate(dataView, function(error) {
                    elem.removeClass('active');
                    if (error === null) {
                        self.$el.find('.save-template-settings .button-save-template').show();
                        self.$el.find('.save-template-settings').addClass('show-notice');
                        self.$el.find('.save-template-settings .error-block').hide();
                        self.settingsModel.set('image', '');
                        self.settingsModel.set('title', '');
                        self.$el.find('.field-text').removeClass('error');
                    } else {
                        if (error.title) {
                            self.$el.find('.field-text').addClass('error');
                            self.$el.find('.save-template-settings .error-block-empty-title').show();
                            self.$el.find('.save-template-settings .button-save-template').hide();
                        }
                        if (error.blocks) {
                            self.$el.find('.save-template-settings .button-save-template').hide();
                            self.$el.find('.save-template-settings .error-block-empty-page').show();
                        }

                    }
                });
            });



        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            var model = QoobUtils.createModel(this.config);

            var data = {
                'save_template': this.storage.__('save_template', 'Save template'),
                'save_loading': this.storage.__('save_process', 'Save...'),
                'save_notice_title': this.storage.__('save_notice_title', 'Your template has been saved successfully!'),
                'save_notice_text': this.storage.__('save_notice_text', 'You can use a ready-made template to create a new page.'),
                'you_cant_save_empty_template': this.storage.__('you_cant_save_empty_template', "You can't save empty template"),
                'you_cant_save_empty_title': this.storage.__('you_cant_save_empty_title', "The name of the template must be at least 1 character")
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


            return this;
        }
    });
