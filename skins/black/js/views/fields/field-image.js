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
            'keyup .image': 'changeInputUrlImage',
            'click .remove': 'clickRemoveImage',
            'click .upload': 'clickUploadImage',
            'change .input-file': 'changeInputFile'
        },
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
        },
        /**
         * Remove image
         * @param {Object} evt
         */
        clickRemoveImage: function(evt) {
            evt.preventDefault();
            this.$el.find('.edit-image img').attr('src', '');
            this.model.set(this.$el.find('input.image').attr('name'), '');
        },
        /**
         * Event change input url image
         * @param {Object} evt
         */
        changeInputUrlImage: function(evt) {
            var url = jQuery(evt.target).val();

            if (url.match(/.(jpg|jpeg|png|gif)$/i)) {
                this.$el.find('img').attr('src', url);
                this.model.set(this.$el.find('input.image').attr('name'), url);
            } else {
                this.$el.find('img').attr('src', '');
                this.model.set(this.$el.find('input.image').attr('name'), '');
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
                this.$el.find('.edit-image img').attr('src', src);
                this.$el.find('input.image').trigger("change");
            }.bind(this);

            var mediaCenter = new ImageCenterView({
                model: this.model,
                controller: this.controller,
                parentId: this.parentId,
                storage: this.storage,
                curSrc: this.$el.find('.edit-image img').attr('src'),
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
                        self.$el.find('img').attr('src', json.url);
                        self.model.set(self.$el.find('input[type="hidden"]').attr('name'), json.url);
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
                'word_press_media_library': this.storage.__('word_press_media_library', 'WordPress media library')
            };

            if (typeof(this.settings.show) == "undefined" || this.settings.show(this.model)) {
                this.$el.html(this.tpl(htmldata));
            }
            return this;
        }
    });
