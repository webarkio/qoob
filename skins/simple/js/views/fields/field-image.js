/*global QoobFieldView, ImageCenterView*/
var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = QoobFieldView.extend(
    /** @lends Fields.image.prototype */
    {
        customItems: null,
        counterDropZone: 0,
        events: {
            'click .media-center': 'clickMediaCenter',
            'change .image-url': 'changeInputUrlImage',
            'click .remove': 'clickRemoveImage',
            'drop .drop-zone': 'dropImage',
            'dragenter .drop-zone': 'dragOnDropZone',
            'dragleave .drop-zone': 'dragLeaveDropZone',
            'global_drag_start': 'showDropZone',
            'global_drag_stop': 'hideDropZone',
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
            this.parentId = options.parentId;
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
            var self = this;
            var droppedFiles = evt.originalEvent.dataTransfer.files;

            if (droppedFiles[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
                this.storage.driver.uploadImage(droppedFiles, function(error, url) {
                    if ('' !== url) {
                        self.changeImage(url);
                        if (self.$el.find('.edit-image').hasClass('empty')) {
                            self.$el.find('.edit-image').removeClass('empty');
                        }
                    }
                });
            } else {
                console.error('file format is not appropriate');
            }

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
        /**
         * Render filed image
         * @returns {Object}
         */
        render: function() {
            var htmldata = {
                hideDeleteButton: this.settings.hideDeleteButton,
                "label": this.settings.label,
                "name": this.settings.name,
                "value": this.getValue(),
                'media_center': this.storage.__('media_center', 'Media Center'),
                'drop_here': this.storage.__('drop_here', 'Drop here'),
                'no_image': this.storage.__('no_image', 'No image'),
                'you_can_drop_it_here': this.storage.__('you_can_drop_it_here', 'You can drop it here')
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
