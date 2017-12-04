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
        events: {
            'keydown': 'keyAction',
            'click .ajax-image': 'clickListImage',
            'keyup .img-search': 'searchFilter',
            'change .image-url': 'changeInputUrlImage',
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
            this.curSrc = options.curSrc;
            this.assets = options.assets;
            this.tags = options.tags;
            this.iframeUrl = options.iframeUrl;
            this.cb = options.cb;
            this.parent = options.parent;

            this.listenTo(this.model, 'change',  function(select){
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
        /**
         * Render ImageCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(_.template(this.storage.getSkinTemplate('field-image-setting-preview'))({
                'curSrc': this.curSrc,
                'search': this.storage.__('search', 'Search'),
                'url': this.storage.__('url', 'url')
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
                this.search();
                this.$el.find('.img-search').autocomplete("search", "");
                return false;
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
                console.error('Invalid file format');
            }
        },
        search: function() {
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

            if (_.isString(filteredWords)) {
                filteredWords = filteredWords.split(',');
            } else if (_.isArray(filteredWords)) {
                filteredWords = filteredWords.join('').split(' ');
            }

            if ((filteredWords.length <= 1 && filteredWords[0] === '') || !filteredWords) {
                var images = this.dataImages.slice(offset, offset + this.limit);
                for (var i = 0; i < images.length; i++) {
                    result.push('<div class="ajax-image' + (images[i].src === this.curSrc ? ' chosen' : '') + '" style="background-image: url(' + images[i].src + ');" data-url="' + images[i].src + '"></div>');
                }
            } else {
                var dataSearchImages = [];
                for (var y = 0; y < this.dataImages.length; y++) {
                    for (var j = 0; j < filteredWords.length; j++) {
                        if (filteredWords[j] !== '' && (this.dataImages[y].tags !== undefined && this.dataImages[y].tags.indexOf(filteredWords[j]) != -1)) {
                            if (dataSearchImages.indexOf(this.dataImages[y]) == -1) {
                                dataSearchImages.push(this.dataImages[y]);
                            }
                        }
                    }
                }

                var searchImages = dataSearchImages.slice(offset, offset + this.limit);
                for (var x = 0; x < searchImages.length; x++) {
                    result.push('<div class="ajax-image' + (searchImages[x].src === this.curSrc ? ' chosen' : '') + '" style="background-image: url(' + searchImages[x].src + ');" data-url="' + searchImages[x].src + '"></div>');
                }
            }

            return result.join('');
        },
        /**
         * Setting an image by clicking it
         * @param {type} evt
         */
        clickListImage: function(evt) {
            if (evt.currentTarget.classList.contains('chosen')) {
                return;
            }
            this.$el.find('.ajax-image').removeClass('chosen');
            evt.currentTarget.classList.add('chosen');

            var url = this.$(evt.currentTarget).data('url');

            this.changeImage(url);

            this.cb(url);
        },
        changeImage: function(url) {
            this.$el.find('.field-image__selected-image img').attr('src', url);

            if (this.$el.find('.field-image-container-inner').hasClass('empty')) {
                this.$el.find('.field-image-container-inner').removeClass('empty');
            }

            this.$el.find('.image-url').val(url);

            this.$el.find('.ajax-image').removeClass('chosen');
            this.curSrc = url;
            this.search();
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
         * Remove view
         */
        dispose: function() {
            this.$el.remove();
            // unbind events that are
            // set on this view
            this.off();
        }
    });