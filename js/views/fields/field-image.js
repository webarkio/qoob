var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = Backbone.View.extend(
        /** @lends Fields.image.prototype */
                {
                    className: "settings-item",
                    imageSettingTpl: null,
                    imageTpl: null,
                    events: {
                        'change input': 'changeInput',
                        'click .btn-upload.btn-builder': 'imageUpload',
                        'click .cross-delete': 'deleteImage',
                        'click .other-photo': 'changeImage'
                    },
                    /**
                     * View field image
                     * @class Fields.image
                     * @augments Backbone.View
                     * @constructs
                     */
                    initialize: function (options) {
                        var self = this;
                        this.storage = options.storage;
                        this.model = options.model;
                        this.settings = options.settings;
                        this.controller = options.controller;
                        this.imageSettingTpl = _.template(this.storage.builderTemplates['field-image-setting-preview']);
                        this.imageTpl = _.template(this.storage.builderTemplates['field-image-preview']);
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
                        return this.model.get(this.settings.name) || this.settings.default;
                    },
                    /**
                     * Image upload
                     * @param {Object} evt
                     */
                    imageUpload: function (evt) {
                        var assets = this.storage.getAssets();
                        var curSrc = jQuery(evt.target).siblings('.edit-image').find('img').attr('src');
                        
                        window.selectFieldImage = function (src) {
                            var img = jQuery(evt.target).prev().find('img');
                            if (src) {
                                img.attr('src', src);
                                jQuery(evt.target).trigger("change");
                                if (!this.$el.find('.edit-image').is(":visible")) {
                                    this.$el.find('.edit-image').show();
                                }
                                if (!this.$el.find('.cross-delete').is(":visible")) {
                                    this.$el.find('.cross-delete').show();
                                }
                            }
                        }.bind(this);

                        var mediaCenter = new MediaCenterView({
                            "model": this.model,
                            "controller": this.controller,
                            "parentId": this.model.owner_id,
                            "storage": this.storage,
                            "curSrc": curSrc,
                            "assets": assets
                        });
                        
                        this.controller.setInnerSettingsView(mediaCenter);
                       
                        return false;
                    },
                    /**
                     * Delete image
                     * @param {type} evt
                     */
                    deleteImage: function (evt) {
                        this.$(evt.target).hide();
                        var item = this.$(evt.target).parents('.settings-item');
                        var name = item.find('input').prop('name');
                        item.find('.edit-image > img').attr('src', '');
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
                        var elem = this.$(evt.currentTarget);
                        this.$el.find('.other-photo').removeClass('active');
                        elem.addClass('active');
                        this.$el.find('.edit-image img').attr('src', elem.find('img').attr('src'));
                        this.$el.find('input').trigger("change");
                        if (!this.$el.find('.edit-image').is(":visible")) {
                            this.$el.find('.edit-image').show();
                        }
                        if (!this.$el.find('.cross-delete').is(":visible")) {
                            this.$el.find('.cross-delete').show();
                        }
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
                            this.$el.html(this.imageTpl(htmldata));
                        }
                        return this;
                    }
                });
