/*global QoobFieldView*/
var Fields = Fields || {};

/**
 * View field video
 */
Fields.video = QoobFieldView.extend(
    /** @lends Fields.video.prototype */
    {
        className: 'field-video field-group',
        customItems: null,
        counterDropZone: 0,
        events: {
            'click .show-media-center': 'clickMediaCenter',
            'click .field-video__remove-video': 'clickRemoveVideo',
            'click .others-item__image': 'clickOtherVideo',
            'drop .field-drop-zone': 'dropVideo',
            'dragenter .field-drop-zone': 'dragOnDropZone',
            'dragleave .field-drop-zone': 'dragLeaveDropZone',
            'global_drag_start': 'globalDragStart',
            'click [data-id]': 'clickAction'
        },
        /**
         * View field video
         * @class Fields.video
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.options = options;
            this.tags = options.settings.tags || null;
            this.tpl = _.template(this.storage.getSkinTemplate('field-video-preview'));
        },
        /**
         * Start action custom menu
         * @param {Object} evt
         */
        clickAction: function(evt) {
            evt.preventDefault();
            var id = jQuery(evt.currentTarget).data("id");

            if (typeof this.storage.driver.fieldVideoActions === "function") {
                var item = this.customItems.find(function(o) {
                    return o.id === id;
                });

                if (item.action) {
                    item.action(this);
                }
            }
        },
        /**
         * Change other video
         * @param {Object} evt
         */
        changeVideo: function(src) {
            this.$el.find('.field-video-container').removeClass('empty');
            if (!src) {
                this.$el.find('.field-video-container').addClass('empty');
            }

            if (src !== '') {
                this.$el.find('.field-video__preview-image').attr('src', src.preview);
                this.model.set(this.$el.find('.field-video__url-hidden').attr('name'), src);
                this.$el.find('.field-video__url-hidden').val(src.url);
                this.$el.find('.field-video__preview-hidden').val(src.preview);
            } else {
                this.$el.find('.field-video__preview-image').attr('src', '');
                this.model.set(this.$el.find('.field-video__url-hidden').attr('name'), '');
                this.$el.find('.field-video__url-hidden').val('');
                this.$el.find('.field-video__preview-hidden').val('');
            }
        },
        /**
         * Click other video
         * @param {Object} evt
         */
        clickOtherVideo: function(evt) {
            var video = this.$(evt.currentTarget).data('src-video'),
                preview = this.$(evt.currentTarget).data('src-preview');

            var src = {
                'url': video,
                'preview': preview
            };

            this.changeVideo(src);
        },
        /**
         * Remove video
         * @param {Object} evt
         */
        clickRemoveVideo: function(evt) {
            evt.preventDefault();
            this.$el.find('.field-video-container').addClass('empty');
            this.changeVideo('');
        },
        /**
         * Drop image on zone
         */
        dropVideo: function(evt) {
            var self = this;
            var droppedFiles = evt.originalEvent.dataTransfer.files;

            // 30 MB limit
            if (droppedFiles[0].size > 31457280) {
                this.$el.find('.field-upload-error').addClass('field-upload-error-active');
            } else {
                if (droppedFiles[0].name.match(/.(mp4|ogv|webm)$/i)) {
                    this.storage.driver.uploadVideo(droppedFiles, function(error, url) {
                        if ('' !== url) {
                            self.changeVideo({'url': url, 'preview': ''});
                            if (!self.$el.find('.field-video-container').hasClass('empty')) {
                                self.$el.find('.field-video-container').addClass('empty');
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
         * Show media center
         * @param {Object} evt
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
            var iframeUrl,
                pattern = /^((http|https):\/\/)/;

            // if url has "http|https"
            if (_.isObject(this.getValue())) {
                if (!pattern.test(this.getValue().preview) && typeof this.storage.driver.getFrontendPageUrl === "function") {
                    iframeUrl = this.storage.driver.getFrontendPageUrl();
                } else {
                    iframeUrl = '';
                }
            } else {
                if (!pattern.test(this.getValue()) && typeof this.storage.driver.getFrontendPageUrl === "function") {
                    iframeUrl = this.storage.driver.getFrontendPageUrl();
                } else {
                    iframeUrl = '';
                }
            }

            var htmldata = {
                label: this.settings.label,
                name: this.settings.name,
                videos: this.settings.presets,
                src: this.getValue(),
                "iframeUrl": iframeUrl,
                hideDeleteButton: this.settings.hideDeleteButton,
                'media_center': this.storage.__('media_center', 'Media center'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'no_poster': this.storage.__('no_poster', 'No poster'),
                'error': this.storage.__('error', 'Error!'),
                'error_text': this.storage.__('error_text', 'Video size can not exceed 30 mb')
            };

            if (typeof this.storage.driver.mainMenu === "function") {
                var staticCustom = [];
                htmldata.customItems = this.customItems = this.storage.driver.fieldVideoActions(staticCustom);
            }

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }

            return this;
        }
    });