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
        dataImages: null,
        offset: 0,
        limit: 12,
        events: {
            'keydown': 'keyAction',
            'click .backward-image': 'backward',
            'click #inner-settings-image .ajax-image': 'selectImage',
            'keyup #inner-settings-image .img-search': 'searchFilter',
            'click .remove': 'deleteImage',
            'click .search-button': 'clickSearchButton',
            'shown': 'afterRender'
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

            this.dataImages = [];
            for (var i = 0; i < this.assets.length; i++) {
                for (var j = 0, asset = this.assets[i]; j < asset.length; j++) {
                    if (asset[j].type === 'image') {
                        this.dataImages.push({ src: this.assets[i][j].src, tags: this.assets[i][j].tags });
                    }
                }
            }
        },
        /**
         * Render ImageCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(this.tpl({
                curSrc: this.curSrc,
                hideDeleteButton: this.hideDeleteButton,
                back: this.storage.__('back', 'Back'),
                search: this.storage.__('search', 'Search'),
                'no_image': this.storage.__('no_image', 'No image'),
            }));

            return this;
        },
        /**
         * Actions to do after element is rendered 
         *
         */
        afterRender: function() {
            var self = this;

            //Inserting tags if such existed
            if (!!this.tags) {
                this.$el.find('.img-search').val(this.tags);
            }

            this.loadMore();
            this.$el.find('.filtered-images').on('scroll', function() {
                if (self.checkLoadMore()) {
                    self.loadMore();
                }
            });
        },
        checkLoadMore: function() {
            var filteredImages = this.$el.find('.filtered-images');
            if (this.$el.find('.inview-images').offset().top < filteredImages.offset().top + (filteredImages.height())) {
                return true;
            } else {
                return false;
            }
        },
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.$el.find(".search-button").click();
            }
        },
        clickSearchButton: function() {
            var filteredWords = this.$el.find('.img-search').val().split(','),
                filteredImages = this.$el.find('.filtered-images');

            filteredImages.find('.ajax-image').remove();

            this.tags = filteredWords;
            this.offset = 0;
            this.loadMore();
        },
        loadMore: function() {
            var filteredImages = this.$el.find('.filtered-images'),
                images = this.getImages(this.tags, this.offset);
            
            if (images) {
                this.offset = this.offset + this.limit;
                filteredImages.find('.inview-images').before(images);
                if (this.checkLoadMore()) {
                    this.loadMore();
                }
            }
        },
        getImages: function(tags, offset) {
            var filteredWords = tags,
                result = [];

            var images = this.dataImages.slice(offset, offset + this.limit);

            for (var i = 0; i < images.length; i++) {
                if ((filteredWords.length <= 1 && filteredWords[0] === '') || !filteredWords) {
                    result.push('<div class="ajax-image"><img src="' + images[i].src + '" alt="" /></div>');
                } else {
                    for (var j = 0; j < filteredWords.length; j++) {
                        var regEx = new RegExp(filteredWords[j].replace(/ /g, ' *'));
                        if (filteredWords[j] !== '' && images[i].tags.join(' ').match(regEx)) {
                            result.push('<div class="ajax-image"><img src="' + images[i].src + '" alt="" /></div>');
                        }
                    }
                }
            }

            return result.join('');
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
            this.$el.find('.image-container img').attr('src', evt.target.getAttribute('src'));
            if (this.$el.find('.selected-image').hasClass('empty')) {
                this.$el.find('.selected-image').removeClass('empty');
            }
            window.selectFieldImage(evt.target.getAttribute('src'));
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
        searchFilter: function() {
            var self = this;

            // Get tags byGroup
            var groupTags = _.groupBy(this.dataImages, function(image) {
                return image.tags;
            });

            // Get array tags
            var tagsList = [];
            _.each(groupTags, function(val, key) {
                if (val) {
                    tagsList.push(key);
                }
            });

            this.$el.find('.img-search').autocomplete({
                source: tagsList,
                select: function() {
                    self.$el.find('.search-button').trigger('click');
                },
            }).data("ui-autocomplete")._renderItem = function(ul, item) {
                //Ul custom class here
                ul.addClass('settings-autocomplete media-autocomplete');
                return jQuery("<li>")
                    .attr("data-value", item.value)
                    .append(item.label)
                    .appendTo(ul);
            };
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
