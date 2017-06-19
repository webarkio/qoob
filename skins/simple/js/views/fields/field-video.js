/*global QoobFieldView, VideoCenterView*/
var Fields = Fields || {};

/**
 * View field video
 */
Fields.video = QoobFieldView.extend(
    /** @lends Fields.video.prototype */
    {
        customItems: null,
        counterDropZone: 0,
        events: {
            'click .media-center': 'clickMediaCenter',
            'click .remove': 'clickRemoveVideo',
            'drop .drop-zone': 'dropVideo',
            'dragenter .drop-zone': 'dragOnDropZone',
            'dragleave .drop-zone': 'dragLeaveDropZone',
            'global_drag_start': 'showDropZone',
            'global_drag_stop': 'hideDropZone',
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
            this.parentId = options.parentId;
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
            if (src !== '') {
                this.$el.find('.video-container img').attr('src', src.preview);
                this.model.set(this.$el.find('input.url').attr('name'), src);
                this.$el.find('input.url').val(src.url);
                this.$el.find('input.preview').val(src.preview);
            } else {
                this.$el.find('.video-container img').attr('src', '');
                this.model.set(this.$el.find('input.url').attr('name'), '');
                this.$el.find('input.url').val('');
                this.$el.find('input.preview').val('');
            }
        },
        /**
         * Remove video
         * @param {Object} evt
         */
        clickRemoveVideo: function(evt) {
            evt.preventDefault();
            this.$el.find('.edit-video').addClass('empty');
            this.changeVideo('');
        },
        /**
         * Show drop zone
         */
        showDropZone: function() {
            this.$el.find('.drop-zone').show();
        },
        /**
         * Hide drop zone
         */
        hideDropZone: function() {
            this.$el.find('.drop-zone').hide();
        },
        /**
         * Drop image on zone
         */
        dropVideo: function(evt) {
            var droppedFiles = evt.originalEvent.dataTransfer.files;
            this.$el.find('input[type="file"]').prop('files', droppedFiles);
            this.counterDropZone = 0;
        },
        /**
         * Drag image on drop zone
         */
        dragOnDropZone: function() {
            this.counterDropZone++;
            this.$el.find('.drop-zone').addClass('hover');
        },
        /**
         * Leave drag image on drop zone
         */
        dragLeaveDropZone: function() {
            this.counterDropZone--;
            if (this.counterDropZone === 0) {
                this.$el.find('.drop-zone').removeClass('hover');
            }
        },
        /**
         * Show media center
         * @param {Object} evt
         */
        clickMediaCenter: function() {
            window.selectFieldVideo = function(src) {
                this.$el.find('.edit-video').removeClass('empty');
                if (!src) {
                    this.$el.find('.edit-video').addClass('empty');
                }
                this.changeVideo(src);
            }.bind(this);

            var videoCenter = new VideoCenterView({
                model: this.model,
                controller: this.controller,
                parentId: this.parentId,
                storage: this.storage,
                src: this.getValue(),
                assets: this.storage.getAssets(),
                tags: this.tags ? this.tags.join(', ') : '',
                hideDeleteButton: this.settings.hideDeleteButton
            });

            this.controller.setInnerSettingsView(videoCenter);

            return false;
        },
        /**
         * Render filed image
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                label: this.settings.label,
                name: this.settings.name,
                src: this.getValue(),
                hideDeleteButton: this.settings.hideDeleteButton,
                'media_center': this.storage.__('media_center', 'Media Center'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'no_video': this.storage.__('no_video', 'No video'),
                'no_poster': this.storage.__('no_poster', 'No poster'),
                'you_can_drop_it_here': this.storage.__('you_can_drop_it_here', 'You can drop it here'),
                'formats': this.storage.__('formats', 'mp4, ogv, webm')
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
