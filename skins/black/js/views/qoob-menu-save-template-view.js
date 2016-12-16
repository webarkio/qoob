/**
 * Create view save template
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuSaveTemplateView = Backbone.View.extend(
    /** @lends QoobMenuSaveTemplateView.prototype */
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
         * @class QoobMenuSaveTemplateView
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
            var sorted = _.sortBy(this.storage.defaultTemplatesCollection.models, function(obj) {
                return obj.id;
            });

            var newId = sorted.length ? sorted[sorted.length-1].id + 1 : 1;

            var dataView = {
                'id': newId,
                'title': this.settingsModel.get('title'),
                'image': this.settingsModel.get('image')
            };

            this.controller.showMenuOverlay();
            this.controller.createTemplate(dataView, function(error, state) {
                self.controller.hideMenuOverlay();
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
                'save_template': this.storage.__('save_template', 'Save template')
            };

            settingsView = new QoobFieldsView({
                model: model,
                settings: this.config,
                defaults: this.defaults,
                storage: this.storage,
                controller: this.controller,
                parentId: this.id
            });

            this.settingsModel = settingsView.model;


            this.$el.html(_.template(this.storage.getSkinTemplate('menu-more-preview'))(data)).find('.settings-blocks-full').prepend(settingsView.render().el);

            return this;
        }
    });