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
            var self = this,
                container = this.$el.find('.field-image-container');
            var droppedFiles = evt.originalEvent.dataTransfer.files;

            // 2 MB limit
            if (droppedFiles[0].size > 2097152) {
                container.addClass('upload-error');
            } else {
                if (droppedFiles[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
                    this.storage.driver.uploadImage(droppedFiles, function(error, url) {
                        if ('' !== url) {
                            self.changeImage(url);
                            if (container.hasClass('empty') || container.hasClass('upload-error')) {
                                container.removeClass('empty upload-error');
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
        /**
         * Render filed image
         * @returns {Object}
         */
        render: function() {
            var presets = [];
            if (this.settings.presets) {
                for (var i = 0; i < this.settings.presets.length; i++) {
                    presets.push(this.controller.layout.viewPort.getIframeUrl(this.settings.presets[i]));
                }
            }

            var data = {
                "hideDeleteButton": this.settings.hideDeleteButton,
                "label": this.settings.label,
                "name": this.settings.name,
                "images": presets,
                "value": this.controller.layout.viewPort.getIframeUrl(this.getValue()),
                'media_center': this.storage.__('media_center', 'Media center'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'error': this.storage.__('error', 'Error!'),
                'error_text': this.storage.__('error_text', 'Image size can not exceed 2 mb')
            };

            if (typeof this.storage.driver.fieldImageActions === "function") {
                var staticCustom = [];
                
                this.customItems = this.storage.driver.fieldImageActions(staticCustom);
                
                for (var x = 0; x < this.customItems.length; x++) {
                    var key = Object.keys(this.customItems[x].label);
                    if (this.storage.translations != null) {
                        this.customItems[x].label = this.storage.__(key, this.customItems[x].label[key]);
                    } else {
                        this.customItems[x].label = this.customItems[x].label[key];
                    }
                }

                data.customItems = this.customItems;
            }

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(data));
            }

            return this;
        }
    });