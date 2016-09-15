var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = QoobFieldView.extend(
        /** @lends Fields.image.prototype */{
            events: {
                'change input': 'changeInput',
                'click .edit-image': 'imageUpload',
                'click .other-photo': 'changeImage'
            },
            /**
             * View field image
             * @class Fields.image
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                QoobFieldView.prototype.initialize.call(this, options);
                this.parentId = options.parentId;
                this.tags = options.settings.tags || null;

                this.tpl = _.template(this.storage.qoobTemplates['field-image-preview']);
            },
            /**
             * Event change input
             * @param {Object} evt
             */
            changeInput: function (evt) {
                this.model.set(this.$(evt.target).attr('name'), this.$('.edit-image img').attr('src'));
            },
            /**
             * Image upload
             * @param {Object} evt
             */
            imageUpload: function (evt) {

                window.selectFieldImage = function (src) {
                    this.$el.find('.edit-image').removeClass('empty');
                    if (!src) {
                        this.$el.find('.edit-image').addClass('empty');
                    }
                    this.$el.find('.edit-image').find('img').attr('src', src);
                    this.$el.find('input').trigger("change");
                    if (this.$el.find('.other-photos').length) {
                        this.$el.find('.other-photo').removeClass('active');
                    }
                }.bind(this);

                var mediaCenter = new ImageCenterView({
                    model: this.model,
                    controller: this.controller,
                    parentId: this.parentId,
                    storage: this.storage,
                    curSrc: this.$el.find('.edit-image').find('img').attr('src'),
                    assets: this.storage.getAssets(),
                    tags: this.tags ? this.tags.join(', ') : '',
                    hideDeleteButton: this.settings.hideDeleteButton
                });

                this.controller.setInnerSettingsView(mediaCenter);

                return false;
            },
            /**
             * Change other image
             * @param {Object} evt
             */
            changeImage: function (evt) {
                var elem = this.$(evt.currentTarget);
                this.$el.find('.other-photo').removeClass('active');
                elem.addClass('active');
                this.$el.find('.edit-image img').attr('src', elem.find('img').attr('src'));
                this.$el.find('input').trigger("change");
            },
            /**
             * Render filed image
             * @returns {Object}
             */
            render: function () {
                var htmldata = {
                    "label": this.settings.label,
                    "name": this.settings.name,
                    "images": this.settings.presets,
                    "value": this.getValue(),
                    'media_center': qoob_lng.fields.media_center
                };

                if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
                    this.$el.html(this.tpl(htmldata));
                }
                return this;
            }
        });
