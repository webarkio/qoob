/**
 * Create ImageCenterView 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var ImageCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends ImageCenterView.prototype */
    {
        className: "inner-settings-image settings inner-settings",
        dataImages: null,
        offset: 0,
        limit: 12,
        numberFoundByTagsImages: 0,
        showAllImages: false,
        events: {
            'change .image-link': 'changeInputLink',
            'keydown': 'keyAction',
            'keyup .img-search': 'searchFilter',
            'blur .img-search': 'blurInput',
            'blur .image-link': 'blurInput',
            'click .backward-button': 'clickBackward',
            'click .ajax-image': 'clickListImage',
            'click .field-input-autocomplete__icon-search': 'clickSearchButton',
            'click .field-input-autocomplete__icon-link': 'clickLinkButton',
            'click .inner-settings-control__button-search': 'showSearchInput',
            'click .inner-settings-control__button-link': 'showLinkInput',
            'click .inner-settings-control__button-reset': 'clickReset',
            'click .inner-settings-control__button-remove': 'clickRemove',
            'click .search-result__remove-text': 'clickRemoveTags',
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
            this.name = options.name;
            this.side = options.side;
            this.storage = options.storage;
            this.controller = options.controller;
            this.settings = options.settings;
            this.defaults = options.defaults;
            this.src = options.src;
            this.assets = options.assets;
            this.tags = options.tags;
            this.parent = options.parent;
            this.cb = options.cb;

            this.listenTo(this.model, 'change', function(select) {
                var image = Object.keys(select.changed)[0];
                this.changeImage(select.changed[image]);
            });

            this.dataImages = [];
            for (var i = 0; i < this.assets.length; i++) {
                for (var j = 0, asset = this.assets[i]; j < asset.length; j++) {
                    if (asset[j].type === 'image') {
                        this.dataImages.push({ src: this.assets[i][j].src, tags: this.assets[i][j].tags });
                    }
                }
            }
        },
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.search();
            } else if (evt.keyCode == 27) {
                this.hiddenFields();
            }
        },
        changeImage: function(url) {
            this.$el.find('.field-image__selected-image img').attr('src', url);

            if (url == '') {
                this.$el.find('.field-image-container-inner').addClass('empty');
            } else if (this.$el.find('.field-image-container-inner').hasClass('empty')) {
                this.$el.find('.field-image-container-inner').removeClass('empty');
            }

            this.$el.find('.image-link').val(url);

            this.src = url;

            this.selectImage(this.src);
        },
        selectImage: function(url) {
            this.$el.find('.ajax-image').removeClass('chosen');
            if (url !== '') {
                var filteredImages = this.$el.find('.filtered-images');
                filteredImages.find("[data-url='" + url + "']").addClass('chosen');
            }
        },
        /**
         * Event change input link image
         * @param {Object} evt
         */
        changeInputLink: function(evt) {
            var url = jQuery(evt.target).val();
            if (url.match(/.(jpg|jpeg|png|gif)$/i)) {
                this.changeImage(url);
            } else {
                console.error('Invalid file format');
            }
        },
        clickBackward: function() {
            this.controller.backward();
        },
        /**
         * Setting an image by clicking it
         * @param {type} evt
         */
        clickListImage: function(evt) {
            if (this.$(evt.currentTarget).hasClass('chosen')) {
                return false;
            }

            var url = this.$(evt.currentTarget).data('url');

            this.cb(url);
        },
        /**
         * Trigger change input link
         */
        clickLinkButton: function() {
            this.$('.image-link').trigger('change');
        },
        /**
         * Trigger search by click
         */
        clickSearchButton: function() {
            this.search();
        },
        /**
         *  Reset to default
         */
        clickReset: function() {
            if (this.defaults != undefined) {
                this.cb(this.defaults);
            }
        },
        /**
         * Remove image
         */
        clickRemove: function() {
            this.cb('');
        },
        clickRemoveTags: function() {
            this.$el.find('.search-result-tags').hide();
            this.$el.find('.img-search').val('');
        },
        showSearchInput: function() {
            this.$el.find('.inner-settings-control__search').addClass('inner-settings-control__search-active');
            this.$el.find('.field-input-autocomplete__text').focus();
        },
        showLinkInput: function() {
            this.$el.find('.inner-settings-control__link').addClass('inner-settings-control__link-active');
            this.$el.find('.field-text__input-link').focus();
        },
        blurInput: function() {
            if (this.$el.find(".field-input-autocomplete__icon-search").is(":active")) {} else if (this.$el.find(".field-input-autocomplete__icon-link").is(":active")) {} else {
                this.hiddenFields();
            }
        },
        hiddenFields: function() {
            this.$el.find('.inner-settings-control__search-active').removeClass('inner-settings-control__search-active');
            this.$el.find('.inner-settings-control__link-active').removeClass('inner-settings-control__link-active');
        },
        search: function() {
            this.$el.find('.ajax-image').remove();
            this.$el.find('.stock-error').remove();

            this.tags = this.$el.find('.img-search').val();
            this.offset = 0;
            this.showAllImages = false;
            this.loadMore();

            if (this.tags != '') {
                this.$el.find('.search-result__tags .search-result__text').html(this.tags);
                this.$el.find('.search-result-tags').show();
            } else {
                this.$el.find('.search-result-tags').hide();
            }

            // hide inputs
            this.hiddenFields();
        },
        /**
         * FIXME: loader for Unsplash
         */
        queueLoader: function() {
            if (this.queue === 0) {
                this.offset = 0;
                this.stockPage = 0;
                this.loadMore();
            } else {
                this.queue--;
            }
        },
        checkLoadMore: function() {
            var filteredImages = this.$el.find('.filtered-images');
            if (this.$el.find('.inview-images').offset().top < filteredImages.offset().top + (filteredImages.height())) {
                return true;
            } else {
                return false;
            }
        },
        loadMore: function() {
            var images;

            this.showLoader();

            if (this.tags == '' || this.showAllImages) {
                images = this.getImages('', this.offset);

                this.showAllSearchResult();

                if (images) {
                    this.offset = this.offset + this.limit;
                    this.$el.find('.search-result-all').append(images);
                    if (this.checkLoadMore()) {
                        this.loadMore();
                    } else {
                        this.hideLoader();
                    }
                } else {
                    this.hideLoader();
                /* Unsplash
                } else {
                    this.stockPage++;
                    this.getUnsplashAllImages(this.stockPage, function(stockImages, isImages) {
                        self.$el.find('.search-result-all').append(stockImages);
                        if (self.checkLoadMore() && isImages) {
                            self.loadMore();
                        } else {
                            self.hideLoader();
                        }
                    });
                */
                }
            } else {
                images = this.getImages(this.tags, this.offset);

                if (this.numberFoundByTagsImages == 0) {
                    this.$el.find('.search-result-tags .search-result__shell-text').hide();
                    this.$el.find('.search-result-tags .no-search-result__text').show();
                } else {
                    this.$el.find('.search-result-tags .search-result__shell-text').show();
                    this.$el.find('.search-result-tags .no-search-result__text').hide();
                    this.$el.find('.search-result-tags .search-result__digit').html(this.numberFoundByTagsImages);
                }

                if (images) {
                    this.offset = this.offset + this.limit;
                    this.$el.find('.search-result-tags').append(images);
                    if (this.checkLoadMore()) {
                        this.loadMore();
                    } else {
                        this.hideLoader();
                    }
                } else {
                    this.showAllImages = true;
                    this.offset = 0;
                    this.loadMore();

                /* Unsplash
                } else {
                    this.stockPage++;
                    this.getUnsplashImages('perm', this.stockPage, function(stockImages, isImages) {
                        self.$el.find('.search-result-tags .search-result__digit').html(self.numberFoundByTagsImages);
                        self.$el.find('.search-result-tags').append(stockImages);
                        if (self.checkLoadMore() && isImages) {
                            self.loadMore();
                        } else {
                            self.hideLoader();
                            self.queueLoader();
                        }
                    });
                */
                }
            }
        },
        /**
         * Get unsplash images by tags
         * @param {String} tags
         * @param {Integer} page
         * @param {Function} cb
         */
        getUnsplashImages: function(tags, page, cb) {
            var self = this,
                images = [];

            jQuery.get("https://api.unsplash.com/search/photos", {
                page: page,
                query: tags,
                per_page: 30,
                client_id: "77964f7b496e52290be0590f8e6dd6b79650d2ba2e49a9d973e1d9695b77adb8"
            }, function(data) {
                var isImages = true;

                // Images count by tags
                if (data.total) {
                    self.numberFoundByTagsImages += data.total;
                }

                if (!data.total_pages || page > data.total_pages) {
                    isImages = false;
                }
                if (data.total_pages) {
                    for (var i = 0; i < data.results.length; i++) {
                        images.push('<div class="ajax-image' + (data.results[i].urls.thumb === this.src ? ' chosen' : '') + '" style="background-image: url(' + data.results[i].urls.thumb + ');" data-url="' + data.results[i].urls.regular + '"></div>');
                    }
                    images = images.join('');
                }

                cb(images, isImages);

            }).fail(function(error) {
                images.push('<div class="stock-error" style="display:block;">Unsplash ' + error.responseJSON.errors[0] + '</div>');
                cb(images.join(''), false);
            });
        },
        /**
         * Get all unsplash images sort by popular
         * @param {Integer} page
         * @param {Function} cb
         */
        getUnsplashAllImages: function(page, cb) {
            var images = [];

            jQuery.get("https://api.unsplash.com/photos", {
                page: page,
                per_page: 30,
                client_id: "77964f7b496e52290be0590f8e6dd6b79650d2ba2e49a9d973e1d9695b77adb8"
            }, function(data) {
                var isImages = true;

                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        images.push('<div class="ajax-image' + (data[i].urls.thumb === this.src ? ' chosen' : '') + '" style="background-image: url(' + data[i].urls.thumb + ');" data-url="' + data[i].urls.regular + '"></div>');
                    }
                    images = images.join('');
                } else {
                    isImages = false;
                }

                cb(images, isImages);

            }).fail(function(error) {
                images.push('<div class="stock-error" style="display:block;">Unsplash ' + error.responseJSON.errors[0] + '</div>');
                cb(images.join(''), false);
            });
        },
        getImages: function(tags, offset) {
            var result = [],
                tagsArr = [];

            if (_.isString(tags)) {
                tagsArr = tags.split(',');
            } else if (_.isArray(tags)) {
                tagsArr = tags.join('').split(' ');
            }

            if ((tagsArr.length == 1 && tagsArr[tagsArr.length - 1] === '')) {
                var images = this.dataImages.slice(offset, offset + this.limit);
                for (var i = 0; i < images.length; i++) {
                    result.push('<div class="ajax-image' + (images[i].src === this.src ? ' chosen' : '') + '" style="background-image: url(' + images[i].src + ');" data-url="' + images[i].src + '"></div>');
                }
            } else {
                var dataSearchImages = [];
                for (var y = 0; y < this.dataImages.length; y++) {
                    for (var j = 0; j < tagsArr.length; j++) {
                        if (tagsArr[j] !== '' && (this.dataImages[y].tags !== undefined && this.dataImages[y].tags.indexOf(tagsArr[j]) != -1)) {
                            if (dataSearchImages.indexOf(this.dataImages[y]) == -1) {
                                dataSearchImages.push(this.dataImages[y]);
                            }
                        }
                    }
                }

                // Images count by tags
                this.numberFoundByTagsImages = dataSearchImages.length;

                var searchImages = dataSearchImages.slice(offset, offset + this.limit);
                for (var x = 0; x < searchImages.length; x++) {
                    result.push('<div class="ajax-image' + (searchImages[x].src === this.src ? ' chosen' : '') + '" style="background-image: url(' + searchImages[x].src + ');" data-url="' + searchImages[x].src + '"></div>');
                }
            }

            return result.join('');
        },
        showAllSearchResult: function() {
            if (!this.$el.find('.search-result-all').is(':visible')) {
                this.$el.find('.search-result-all').show();
                this.$el.find('.search-result-all .search-result__digit').html(this.dataImages.length);
            }
        },
        showLoader: function() {
            if (!this.$el.find('.settings-media-loader').is(':visible')) {
                this.$el.find('.settings-media-loader').show();
            }
        },
        hideLoader: function() {
            this.$el.find('.settings-media-loader').hide();
        },
        /**
         * Keyup event for filtering images by tags in search input
         * @param {type} evt
         */
        searchFilter: function() {
            var self = this;

            var groupTags = [],
                data = this.dataImages;

            for (var i = 0; i < data.length; i++) {
                if (!_.isUndefined(data[i].tags)) {
                    groupTags.push(data[i].tags);
                }
            }

            var tagsList = _.union(_.flatten(groupTags));

            this.$el.find('.img-search').autocomplete({
                source: tagsList,
                select: function() {
                    self.search();
                },
            }).data("ui-autocomplete")._renderItem = function(ul, item) {
                //Ul custom class here
                ul.addClass('field-input-autocomplete-list field-input-autocomplete-list-inner');
                return jQuery("<li>")
                    .attr("data-value", item.value)
                    .append("<div>" + item.label + "</div>")
                    .appendTo(ul);
            };
        },
        /**
         * Render ImageCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(_.template(this.storage.getSkinTemplate('field-image-setting-preview'))({
                "hideDeleteButton": this.settings.hideDeleteButton,
                'search': this.storage.__('search', 'Search'),
                'url': this.storage.__('url', 'url'),
                'back': this.storage.__('back', 'Back'),
                'text_results': this.storage.__('results', 'Results'),
                'text_all_images': this.storage.__('allImages', 'All images'),
                'more_than_million': this.storage.__('moreThanAMillion', 'more than a million'),
                'no_search_result': this.storage.__('noResult', 'No results'),
                'src': this.src,
                'tags': this.tags
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

            this.search();

            this.$el.find('.filtered-images').on('scroll', function() {
                if (self.checkLoadMore()) {
                    self.loadMore();
                }
            });
        },
        /**
         * Remove view
         */
        dispose: function() {
            this.$el.remove();
            // unbind events view
            this.off();
        }
    });