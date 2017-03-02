/*global QoobFieldView, VideoCenterView*/
var Fields = Fields || {};

/**
 * View field video
 */
Fields.video = QoobFieldView.extend(
    /** @lends Fields.video.prototype */
    {
        events: {
            'click .media-center': 'clickMediaCenter',
            'click .remove': 'clickRemoveVideo',
            'click .reset': 'clickResetVideoToDefault'
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
        clickResetVideoToDefault: function(evt) {
            evt.preventDefault();
            this.changeVideo(this.options.defaults);
            if (this.$el.find('.edit-video').hasClass('empty')) {
                this.$el.find('.edit-video').removeClass('empty');
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
                'no_video': this.storage.__('no_video', 'No video'),
                'reset_to_default': this.storage.__('reset_to_default', 'Reset to default')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }

            return this;
        }
    });
