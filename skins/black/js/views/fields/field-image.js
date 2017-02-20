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
            'keyup change .image-url': 'changeInputUrlImage',
            'click .remove': 'clickRemoveImage',
            'click .upload': 'clickUploadImage',
            'change .input-file': 'changeInputFile',
            'drop .drop-zone': 'dropImage',
            'dragenter .drop-zone': 'dragOnDropZone',
            'dragleave .drop-zone': 'dragLeaveDropZone'
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
            this.parentId = options.parentId;
            this.tags = options.settings.tags || null;

            this.tpl = _.template(this.storage.getSkinTemplate('field-image-preview'));

            // init drag image
            this.dragImage();
        },
        /**
         * Remove image
         * @param {Object} evt
         */
        clickRemoveImage: function(evt) {
            evt.preventDefault();
            this.$el.find('.preview-image').attr('src', '');
            this.$el.find('.image-url').val('');
            this.$el.find('.img-container').hide();
            this.$el.find('.no-image').show();
            this.model.set(this.$el.find('.image-url').attr('name'), '');
        },
        /**
         * Drag image on screen
         */
        dragImage: function() {
            var self = this,
                counter = 0,
                viewport = jQuery('#qoob-viewport');
            jQuery('#qoob').on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                })
                .on('dragenter', function() {
                    counter++;
                    self.$el.find('.drop-zone').show();
                    if (counter === 1) {
                        jQuery('<div/>', {class: 'temporary-viewport'}).appendTo(viewport);
                    }
                })
                .on('dragleave', function() {
                    counter--;
                    if (counter === 0) {
                        self.$el.find('.drop-zone').hide();
                        viewport.find('.temporary-viewport').remove();
                    }
                })
                .on('drop', function() {
                    self.$el.find('.drop-zone').hide();
                });
        },
        /**
         * Drop image on zone
         */
        dropImage: function(evt) {
            var droppedFiles = evt.originalEvent.dataTransfer.files;
            this.$el.find('input[type="file"]').prop('files', droppedFiles);
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
            console.log('change');
            if (url.match(/.(jpg|jpeg|png|gif)$/i)) {
                this.$el.find('.preview-image').attr('src', url);
                this.model.set(jQuery(evt.target).attr('name'), url);
            } else {
                this.$el.find('.preview-image').attr('src', '');
                this.model.set(jQuery(evt.target).attr('name'), '');
                console.error('file format is not appropriate');
            }
        },
        /**
         * Show media center side
         */
        clickMediaCenter: function() {
            window.selectFieldImage = function(src) {
                this.$el.find('.edit-image').removeClass('empty');
                if (!src) {
                    this.$el.find('.edit-image').addClass('empty');
                }
                this.$el.find('.preview-image').attr('src', src);
                this.$el.find('.image-url').val(src);
                this.$el.find('.img-container').show();
                this.$el.find('.no-image').hide();
                this.model.set(this.$el.find('.image-url').attr('name'), src);

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
        /**
         * Image upload
         * @param {Object} evt
         */
        clickUploadImage: function(evt) {
            evt.preventDefault();
            this.$el.find('input.input-file').trigger('click');
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
                        self.$el.find('.preview-image').attr('src', json.url);
                        self.model.set(self.$el.find('.image-url').attr('name'), json.url);
                        self.$el.find('.image-url').val(json.url);
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
                'word_press_media_library': this.storage.__('word_press_media_library', 'WordPress media library'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'no_image': this.storage.__('no_image', 'No image'),
                'you_can_drop_it_here': this.storage.__('you_can_drop_it_here', 'You can drop it here')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }

            return this;
        }
    });
