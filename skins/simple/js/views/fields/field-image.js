/*global QoobFieldView*/
var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = QoobFieldView.extend(
    /** @lends Fields.image.prototype */
    {
        className: 'field-image field-group',
        customItems: null,
        counterDropZone: 0,
        events: {
            'click .show-media-center': 'clickMediaCenter',
            'click .field-image__remove-image': 'clickRemoveImage',
            'click .others-item__image': 'clickOtherImage',
            'drop .field-drop-zone': 'dropImage',
            'dragenter .field-drop-zone': 'dragOnDropZone',
            'dragleave .field-drop-zone': 'dragLeaveDropZone',
            'global_drag_start': 'globalDragStart',
            'click [data-id]': 'clickAction'
        },
        /**
         * View field image
         * @class Fields.image
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.options = options;
            this.tags = options.settings.tags || null;
            this.tpl = _.template(this.storage.getSkinTemplate('field-image-preview'));
        },
        /**
         * Start action custom menu
         * @param {Object} evt
         */
        clickAction: function(evt) {
            evt.preventDefault();
            var id = jQuery(evt.currentTarget).data("id");

            if (typeof this.storage.driver.fieldImageActions === "function") {
                var item = this.customItems.find(function(o) {
                    return o.id === id;
                });

                if (item.action) {
                    item.action(this);
                }
            }
        },
        /**
         * Main method change image
         * @param {String} url image
         */
        changeImage: function(url) {
            this.$el.find('.field-image-container').removeClass('empty');
            if (!url) {
                this.$el.find('.field-image-container').addClass('empty');
            }
            this.$el.find('.field-image__preview-image').attr('src', url);
            this.model.set(this.$el.find('.field-image__url-hidden').attr('name'), url);
            this.$el.find('.field-image__url-hidden').val(url);
        },
        /**
         * Click other image
         * @param {Object} evt
         */
        clickOtherImage: function(evt) {
            var bg = this.$(evt.currentTarget).css('background-image'),
                url = bg.replace('url(', '').replace(')', '').replace(/\"/gi, "");
            this.changeImage(url);
        },
        /**
         * Remove image
         */
        clickRemoveImage: function() {
            this.$el.find('.field-image-container').addClass('empty');
            this.changeImage('');
        },
        /**
         * Drop image on zone
         */
        dropImage: function(evt) {
            var self = this;
            var droppedFiles = evt.originalEvent.dataTransfer.files;

            // 30 MB limit
            if (droppedFiles[0].size > 2097152) {
                this.$el.find('.field-image__preview').hide();
                this.$el.find('.field-upload-error').addClass('field-upload-error-active');

            } else {
                if (droppedFiles[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
                    this.storage.driver.uploadImage(droppedFiles, function(error, url) {
                        if ('' !== url) {
                            self.changeImage(url);
                            if (self.$el.find('.field-image-container').hasClass('empty')) {
                                self.$el.find('.field-image-container').removeClass('empty');
                            }
                        }
                    });
                } else {
                    console.error('file format is not appropriate');
                }
            }

            this.counterDropZone = 0;
        },
        /**
         * Global trigger drag start
         */
        globalDragStart: function() {
            var uploadError = this.$el.find('.field-upload-error');
            if (uploadError.hasClass('field-upload-error-active')) {
                uploadError.removeClass('field-upload-error-active');
            }
        },
        /**
         * Drag image on drop zone
         */
        dragOnDropZone: function() {
            this.counterDropZone++;
            this.$el.find('.field-drop-zone').addClass('hover');
        },
        /**
         * Leave drag image on drop zone
         */
        dragLeaveDropZone: function() {
            this.counterDropZone--;
            if (this.counterDropZone === 0) {
                this.$el.find('.field-drop-zone').removeClass('hover');
            }
        },
        /**
         * Show media center images
         */
        clickMediaCenter: function() {
            this.controller.navigate(this.controller.currentUrl() + "/" + this.settings.name, true);
            return false;
        },
        getIframeUrl: function() {
            var iframeUrl, pattern = /^((http|https):\/\/)/;

            // if url has "http|https"
            if (!pattern.test(this.getValue()) && typeof this.storage.driver.getFrontendPageUrl === "function") {
                iframeUrl = this.storage.driver.getFrontendPageUrl();
            } else {
                iframeUrl = '';
            }

            return iframeUrl;
        },
        /**
         * Render filed image
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                hideDeleteButton: this.settings.hideDeleteButton,
                "label": this.settings.label,
                "name": this.settings.name,
                "images": this.settings.presets,
                "value": this.getValue(),
                "iframeUrl": this.getIframeUrl(),
                'media_center': this.storage.__('media_center', 'Media center'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'error': this.storage.__('error', 'Error!'),
                'error_text': this.storage.__('error_text', 'Image size can not exceed 2 mb')
            };

            if (typeof this.storage.driver.mainMenu === "function") {
                var staticCustom = [];
                htmldata.customItems = this.customItems = this.storage.driver.fieldImageActions(staticCustom);
            }

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }

            return this;
        }
    });