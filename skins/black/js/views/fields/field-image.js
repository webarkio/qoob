/*global QoobFieldView, ImageCenterView*/
var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = QoobFieldView.extend(
    /** @lends Fields.image.prototype */
    {
        events: {
            'click .media-center': 'clickMediaCenter',
            'change .image-url': 'changeInputUrlImage',
            'click .remove': 'clickRemoveImage',
            'click .upload': 'clickUploadImage',
            'click .reset': 'clickResetImageToDefault',
            'change .input-file': 'changeInputFile',
            'drop .drop-zone': 'dropImage',
            'dragenter .drop-zone': 'dragOnDropZone',
            'dragleave .drop-zone': 'dragLeaveDropZone',
            'global_drag_start': 'showDropZone',
            'global_drag_stop': 'hideDropZone'
        },
        counterDropZone: 0,
        /**
         * View field image
         * @class Fields.image
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            QoobFieldView.prototype.initialize.call(this, options);
            this.options = options;
            this.parentId = options.parentId;
            this.tags = options.settings.tags || null;
            this.tpl = _.template(this.storage.getSkinTemplate('field-image-preview'));
        },
        /**
         * Main method change image
         * @param {String} url image
         */
        changeImage: function(url) {
            this.$el.find('.preview-image').attr('src', url);
            this.model.set(this.$el.find('.image-url').attr('name'), url);
            this.$el.find('.image-url').val(url);
        },
        /**
         * Remove image
         * @param {Object} evt
         */
        clickRemoveImage: function(evt) {
            evt.preventDefault();
            this.$el.find('.edit-image').addClass('empty');
            this.changeImage('');
        },
        clickResetImageToDefault: function(evt) {
            evt.preventDefault();
            this.changeImage(this.options.defaults);
            if (this.$el.find('.edit-icon').hasClass('empty')) {
                this.$el.find('.edit-icon').removeClass('empty');
            }
        },
        /**
         * Image upload
         * @param {Object} evt
         */
        clickUploadImage: function(evt) {
            evt.preventDefault();
            this.$el.find('input.input-file').trigger('click');
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
        dropImage: function(evt) {
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
         * Event change input url image
         * @param {Object} evt
         */
        changeInputUrlImage: function(evt) {
            var url = jQuery(evt.target).val();
            if (url.match(/.(jpg|jpeg|png|gif)$/i)) {
                this.changeImage(url);
            } else {
                this.changeImage('');
            }
        },
        /**
         * Show media center images
         */
        clickMediaCenter: function() {
            window.selectFieldImage = function(src) {
                this.$el.find('.edit-image').removeClass('empty');
                if (!src) {
                    this.$el.find('.edit-image').addClass('empty');
                }
                this.changeImage(src);

            }.bind(this);

            var mediaCenter = new ImageCenterView({
                model: this.model,
                controller: this.controller,
                parentId: this.parentId,
                storage: this.storage,
                curSrc: this.$el.find('.preview-image').attr('src'),
                assets: this.storage.getAssets(),
                tags: this.tags ? this.tags.join(', ') : '',
                hideDeleteButton: this.settings.hideDeleteButton
            });

            this.controller.setInnerSettingsView(mediaCenter);

            return false;
        },
        changeInputFile: function(evt) {
            var self = this;
            var file = jQuery(evt.target).val();

            if (file.match(/.(jpg|jpeg|png|gif)$/i)) {
                var formData = new FormData();
                formData.append(jQuery(evt.target).attr('name'), this.$el.find('input[type=file]')[0].files[0], this.$el.find('input[type=file]')[0].files[0].name);
                jQuery.ajax({
                    url: '/upload',
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    error: function(jqXHR, textStatus) {
                        console.error(textStatus);
                    },
                    success: function(data) {
                        var json = JSON.parse(data);
                        self.changeImage(json.url);
                    }
                });
            } else {
                console.error('file format is not appropriate');
            }
        },
        /**
         * Render filed image
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                "label": this.settings.label,
                "name": this.settings.name,
                "value": this.getValue(),
                'media_center': this.storage.__('media_center', 'Media Center'),
                'upload': this.storage.__('upload', 'Upload'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'no_image': this.storage.__('no_image', 'No image'),
                'you_can_drop_it_here': this.storage.__('you_can_drop_it_here', 'You can drop it here'),
                'reset_to_default': this.storage.__('reset_to_default', 'Reset to default')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }

            return this;
        }
    });
