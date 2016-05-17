var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = FieldView.extend(
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
                FieldView.prototype.initialize.call(this, options);
                this.tpl = _.template(this.storage.builderTemplates['field-image-preview']);
            },
            /**
             * Event change input
             * @param {Object} evt
             */
            changeInput: function (evt) {
                var target = this.$(evt.target);
                this.model.set(target.attr('name'), target.prev().find('img').attr('src'));
            },
            /**
             * Image upload
             * @param {Object} evt
             */
            imageUpload: function (evt) {
                var assets = this.storage.getAssets();
                
                window.selectFieldImage = function (src) {
                    if (src) {
                        this.$el.find('.edit-image').find('img').attr('src', src);
                        if (src === 'empty') {
                            this.$el.find('.edit-image').addClass('empty');
                        }
                        this.$el.find('input').trigger("change");
                        if (this.$el.find('.other-photos').length) {
                            this.$el.find('.other-photo').removeClass('active');
                        }
                    }
                }.bind(this);

                var mediaCenter = new MediaCenterView({
                    "model": this.model,
                    "controller": this.controller,
                    "parentId": this.model.owner_id,
                    "storage": this.storage,
                    "curSrc": this.$el.find('.edit-image').find('img').attr('src'),
                    "assets": assets
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
                    "images": this.settings.images,
                    "value": this.getValue()
                };

                if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
                    this.$el.html(this.tpl(htmldata));
                }
                return this;
            }
        });
