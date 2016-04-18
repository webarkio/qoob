var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = Backbone.View.extend(
        /** @lends Fields.image.prototype */
                {
                    className: "settings-item",
                    image_settingTpl: null,
                    imageTpl: null,
                    events: {
                        'change input': 'changeInput',
                        'click input': 'imageUpload',
                        'click .cross-delete': 'deleteImage',
                        'click .other-photo': 'changeImage'
                    },
                    /**
                     * View field image
                     * @class Fields.image
                     * @augments Backbone.View
                     * @constructs
                     */
                    initialize: function () {
                        this.image_settingTpl = _.template(builder.storage.getFieldTemplate('field-image-setting'));
                        this.imageTpl = _.template(builder.storage.getFieldTemplate('field-image'));
                    },
                    /**
                     * Event change input
                     * @param {Object} evt
                     */
                    changeInput: function (evt) {
                        var target = jQuery(evt.target);
                        this.model.set(target.attr('name'), target.prev().find('img').attr('src'));
                    },
                    /**
                     * Get value field image
                     * @returns {String}
                     */
                    getValue: function () {
                        return this.model.get(this.config.name) || this.config.default;
                    },
                    /**
                     * Image upload
                     * @param {Object} evt
                     */
                    imageUpload: function (evt) {
                        var blockId = jQuery(evt.target).closest('.settings.menu-block').attr('id').match(new RegExp(/(\d)+/))[0];
                        var markup = '';
                        var assets = builder.storage.getAssets();

                        window.selectFieldImage = function (src) {
                            var img = jQuery(evt.target).prev().find('img');
                            if (src && src != '') {
                                img.attr('src', src);
                                jQuery(evt.target).trigger("change");
                            }
                        };

                        markup = Fields.image.prototype.createAssetsMarkup(blockId, assets, this.image_settingTpl);
                        builder.menu.showInnerSettings(blockId, markup);

                        return false;
                    },
                    /**
                     * Creating media center imagea preview markup 
                     * @param {string} blockId Id of the current block
                     * @param {Array} assets Assets object from all config files
                     * @returns {String} Resulted markup
                     */
                    createAssetsMarkup: function (blockId, assets, template) {
                        var imagesMarkup = '';
                        var htmldata = {
                            "blockId": blockId,
                            "assets": assets
                        }
                        var markup = template(htmldata);
                        return markup;
                    },
                    /**
                     * Delete image
                     * @param {type} evt
                     */
                    deleteImage: function (evt) {
                        jQuery(evt.target).hide();
                        var item = jQuery(evt.target).parents('.settings-item');
                        var name = item.find('input').prop('name');
                        item.find('edit-image > img').attr('src', '');
                        item.find('.edit-image').hide();
                        if (this.$el.find('.other-photos').length) {
                            this.$el.find('.other-photo').removeClass('active');
                        }
                        this.model.set(name, '');
                    },
                    /**
                     * Change other image
                     * @param {Object} evt
                     */
                    changeImage: function (evt) {
                        var elem = jQuery(evt.currentTarget);
                        this.$el.find('.other-photo').removeClass('active');
                        elem.addClass('active');
                        this.$el.find('.edit-image img').attr('src', elem.find('img').attr('src'));
                        this.$el.find('input').trigger("change");
                        if (!this.$el.find('.edit-image').is(":visible")) {
                            this.$el.find('.edit-image').show();
                        }
                    },
                    /**
                     * Render filed image
                     * @returns {Object}
                     */
                    render: function () {
                        var htmldata = {
                            "label": this.config.label,
                            "name": this.config.name,
                            "images": this.config.images,
                            "value": this.getValue()
                        }

                        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
                            this.$el.html(this.imageTpl(htmldata));
                        }
                        return this;
                    }
                });
