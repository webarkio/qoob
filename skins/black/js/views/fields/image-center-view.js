/*global window*/
/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var ImageCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends ImageCenterView.prototype */
    {
        className: "settings menu-block",
        dataImages: [],
        events: {
            'click .backward-image': 'backward',
            'click #inner-settings-image .ajax-image': 'selectImage',
            'keyup #inner-settings-image .img-search': 'searchFilter',
            'click .remove': 'deleteImage',
            'click .search-button': 'clickSearchButton'
        },
        /**
         * Set setting's id
         * @class SettingsView
         * @augments Backbone.View
         * @constructs
         */
        attributes: function() {
            return {
                id: "settings-block-media",
                'data-side-id': 'settings-block-media'
            };
        },
        /**
         * View ImageCenter
         * @class ImageCenterView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.controller = options.controller;
            this.tpl = _.template(this.storage.getSkinTemplate('field-image-setting-preview'));
            this.backId = (options.parentId === undefined) ? this.model.id : options.parentId;
            this.curSrc = options.curSrc;
            this.assets = options.assets;
            this.tags = options.tags;
            this.hideDeleteButton = options.hideDeleteButton;
        },
        /**
         * Render ImageCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(this.tpl({
                curSrc: this.curSrc,
                assets: this.assets,
                hideDeleteButton: this.hideDeleteButton,
                back: this.storage.__('back', 'Back'),
                search: this.storage.__('search', 'Search'),
                'no_image': this.storage.__('no_image', 'No image'),
            }));

            this.afterRender();

            return this;
        },
        /**
         * Actions to do after element is rendered 
         *
         */
        afterRender: function() {
            var assets = this.assets;

            //Inserting tags if such existed
            if (!!this.tags) {
                this.$el.find('.img-search').val(this.tags);
            }

            for (var i = 0; i < assets.length; i++) {
                for (var j = 0, asset = assets[i]; j < asset.length; j++) {
                    if (asset[j].type === 'image') {
                        this.dataImages.push({ src: assets[i][j].src, tags: assets[i][j].tags });
                    }
                }
            }

            this.loadImages();
        },
        clickSearchButton: function() {
            var images, filteredWords = this.$el.find('.img-search').val().split(','),
                filteredImages = this.$el.find('.filtered-images');

            images = this.getImages(filteredWords);
            filteredImages.empty();
            filteredImages.append(images);
        },
        /**
         * Load images
         * @returns {String} html
         */
        loadImages: function() {
            var images, tags = this.tags,
                filteredImages = this.$el.find('.filtered-images');

            images = this.getImages(tags);
            filteredImages.append(images);
        },
        getImages: function(tags) {
            var filteredWords = tags,
                images = this.dataImages,
                imgs = [];

            if ((filteredWords.length <= 1 && filteredWords[0] === '') || !filteredWords) {
                for (var i = 0; i < 100; i++) {
                    if (images[i] == undefined) {
                        break;
                    }
                    imgs.push('<div class="ajax-image"><img src="' + images[i].src + '" alt="" /></div>');
                }
            } else {
                for (var obj = 0; obj < images.length; obj++) {
                    for (var j = 0; j < filteredWords.length; j++) {
                        var regEx = new RegExp(filteredWords[j].replace(/ /g, ' *'));
                        if (filteredWords[j] !== '' && images[obj].tags.join(' ').match(regEx)) {
                            imgs.push('<div class="ajax-image"><img src="' + images[obj].src + '" alt="" /></div>');
                        }
                    }
                }
            }

            return imgs.join('');
        },

        /**
         * Returning to main block settings on clicking back button
         * @returns {undefined}
         */
        backward: function(e) {
            e.preventDefault();
            this.controller.layout.menu.rotateBackward(this.backId);
        },
        /**
         * Setting an image by clicking it
         * @param {type} evt
         * @returns {undefined}
         */
        selectImage: function(evt) {
            this.$el.find('.ajax-image').removeClass('chosen');
            evt.currentTarget.classList.add('chosen');
            window.selectFieldImage(evt.target.getAttribute('src'));
            this.$el.find('.select-image-container img').attr('src', evt.target.getAttribute('src'));
            if (this.$el.find('.selected-image').hasClass('empty')) {
                this.$el.find('.selected-image').removeClass('empty');
            }
        },
        /**
         * Delete image
         * @param {type} evt
         */
        deleteImage: function(evt) {
            evt.preventDefault();
            window.selectFieldImage('');
            this.$el.find('.selected-image').addClass('empty');
            this.$el.find('.ajax-image').removeClass('chosen');
        },
        /**
         * Keyup event for filtering images by tags in search input
         * @param {type} evt
         */
        searchFilter: function(evt) {
            var filteredImages = this.$el.find('.filtered-images'),
                filteredWords = evt.target.value.split(','),
                images;

            images = this.getImages(filteredWords);
            filteredImages.empty();
            filteredImages.append(images);
        },
        /**
         * Remove view
         */
        dispose: function() {
            this.$el.remove();
            // unbind events that are
            // set on this view
            this.off();
        }
    });
