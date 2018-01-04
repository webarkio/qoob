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

            this.$el.find('.field-video-container').removeClass('empty-preview');
            if (!src) {
                this.$el.find('.field-video-container').addClass('empty-preview');
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
            var self = this,
                container = this.$el.find('.field-video-container');
            var droppedFiles = evt.originalEvent.dataTransfer.files;

            // 30 MB limit
            if (droppedFiles[0].size > 31457280) {
                container.addClass('upload-error');
            } else {
                if (droppedFiles[0].name.match(/.(mp4|ogv|webm)$/i)) {
                    this.storage.driver.uploadVideo(droppedFiles, function(error, url) {
                        if ('' !== url) {
                            self.changeVideo({'url': url, 'preview': ''});
                            if (container.hasClass('empty') || container.hasClass('upload-error')) {
                                container.removeClass('empty upload-error');
                            }
                            if (!container.hasClass('empty-preview')) {
                                container.addClass('empty-preview');
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
            var presets = [], src;
            if (this.settings.presets) {
                for (var i = 0; i < this.settings.presets.length; i++) {
                    if (this.settings.presets[i].preview != undefined) {
                        presets.push({
                            "url": this.controller.layout.viewPort.getIframeUrl(this.settings.presets[i].url),
                            "preview": this.controller.layout.viewPort.getIframeUrl(this.settings.presets[i].preview)
                        });
                    }
                }
            }

            if (_.isObject(this.getValue())) {
                src = {
                    "url": this.controller.layout.viewPort.getIframeUrl(this.getValue().url),
                    "preview": this.controller.layout.viewPort.getIframeUrl(this.getValue().preview)
                };
            } else {
                src = this.controller.layout.viewPort.getIframeUrl(this.getValue());
            }

            var data = {
                'label': this.settings.label,
                'name': this.settings.name,
                'videos': presets,
                'src': src,
                'hideDeleteButton': this.settings.hideDeleteButton,
                'media_center': this.storage.__('media_center', 'Media center'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'no_poster': this.storage.__('no_poster', 'No poster'),
                'error': this.storage.__('error', 'Error!'),
                'error_text': this.storage.__('error_text', 'Video size can not exceed 30 mb')
            };

            if (typeof this.storage.driver.fieldVideoActions === "function") {
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