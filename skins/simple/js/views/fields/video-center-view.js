/**
 * Create VideoCenterView 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var VideoCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends VideoCenterView.prototype */
    {
        className: "inner-settings-video settings inner-settings",
        dataVideos: null,
        offset: 0,
        limit: 12,
        numberFoundByTagsVideos: 0,
        showAllVideos: false,
        events: {
            'keydown': 'keyAction',
            'keyup .video-search': 'searchFilter',
            'blur .video-search': 'blurInput',
            'click .ajax-video': 'clickListVideo',
            'click .backward-button': 'clickBackward',
            'click .field-input-autocomplete__icon-search': 'clickSearchButton',
            'click .inner-settings-control__button-search': 'showSearchInput',
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
                'id': 'settings-block-media',
                'data-side-id': 'settings-block-media'
            };
        },
        /**
         * View VideoCenter
         * @class VideoCenterView
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
            this.tags = options.tags;
            this.cb = options.cb;
            this.parent = options.parent;

            var self = this;

            this.listenTo(this.model, 'change', function(select) {
                var video = Object.keys(select.changed)[0];
                if (video == self.settings.name) {
                    self.changeVideo({ 'url': select.changed[video].url, 'preview': select.changed[video].preview });
                }
            });

            //Getting info about all video assets
            this.dataVideos = this.storage.getVideoAssets();
        },
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.search();
            } else if (evt.keyCode == 27) {
                this.hiddenFields();
            }
        },
        changeVideo: function(src) {
            this.$el.find('.field-video__selected-video img').attr('src', src.preview);

            var $container = this.$el.find('.field-video-container-inner');

            if (src.url === undefined || src.preview == '') {
                $container.addClass('empty');
            } else if ($container.hasClass('empty')) {
                $container.removeClass('empty');
            }

            this.src = src;

            this.selectVideo(this.src);
        },
        selectVideo: function(src) {
            this.$el.find('.ajax-video').removeClass('chosen');
            if (src !== '') {
                this.$el.find('.filtered-videos').find("[data-src='" + src.url + "']").addClass('chosen');
            }
        },
        clickBackward: function() {
            this.controller.backward();
        },
        /**
         * Setting an video by clicking it
         * @param {type} evt
         * @returns {undefined}
         */
        clickListVideo: function(evt) {
            if (evt.currentTarget.classList.contains('chosen')) {
                return;
            }
            this.$el.find('.ajax-video').removeClass('chosen');
            evt.currentTarget.classList.add('chosen');

            var url = this.$(evt.currentTarget).data('src'),
                preview = this.$(evt.currentTarget).data('preview');

            var src = {
                'url': url,
                'preview': preview
            };
            this.cb(src);
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
         * Remove video
         */
        clickRemove: function() {
            this.cb('');
        },
        clickRemoveTags: function() {
            this.$el.find('.search-result-tags').hide();
            this.$el.find('.video-search').val('');
        },
        showSearchInput: function() {
            this.$el.find('.inner-settings-control__search').addClass('inner-settings-control__search-active');
            this.$el.find('.field-input-autocomplete__text').focus();
        },
        blurInput: function() {
            if (!this.$el.find(".field-input-autocomplete__icon-search").is(":active")) {
                this.hiddenFields();
            }
        },
        hiddenFields: function() {
            this.$el.find('.inner-settings-control__search-active').removeClass('inner-settings-control__search-active');
        },
        search: function() {
            this.$el.find('.ajax-video').remove();
            this.tags = this.$el.find('.video-search').val();

            this.offset = 0;
            this.showAllVideos = false;
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
        checkLoadMore: function() {
            var filteredVideos = this.$el.find('.filtered-videos');
            if (this.$el.find('.inview-videos').offset().top < filteredVideos.offset().top + (filteredVideos.height())) {
                return true;
            } else {
                return false;
            }
        },
        loadMore: function() {
            this.showLoader();

            var videos;

            if (this.tags == '' || this.showAllVideos) {
                this.showAllSearchResult();

                videos = this.getVideos('', this.offset);
                if (videos) {
                    this.offset = this.offset + this.limit;
                    this.$el.find('.search-result-all').append(videos);

                    if (this.checkLoadMore()) {
                        this.loadMore();
                    } else {
                        this.hideLoader();
                    }
                } else {
                    this.hideLoader();
                }
            } else {
                videos = this.getVideos(this.tags, this.offset);

                if (this.numberFoundByTagsVideos == 0) {
                    this.$el.find('.search-result-tags .search-result__shell-text').hide();
                    this.$el.find('.search-result-tags .no-search-result__text').show();
                } else {
                    this.$el.find('.search-result-tags .search-result__shell-text').show();
                    this.$el.find('.search-result-tags .no-search-result__text').hide();
                    this.$el.find('.search-result-tags .search-result__digit').html(this.numberFoundByTagsVideos);
                }

                if (videos) {
                    this.offset = this.offset + this.limit;
                    this.$el.find('.search-result-tags').append(videos);
                    if (this.checkLoadMore()) {
                        this.loadMore();
                    } else {
                        this.hideLoader();
                    }
                } else {
                    this.showAllVideos = true;
                    this.offset = 0;
                    this.loadMore();
                }
            }
        },
        getVideos: function(tags, offset) {
            var tagsArr = tags,
                result = [];

            if (tags.indexOf(',') > -1) {
                tagsArr = tags.split(',').map(function(item) {
                    return item.trim();
                });
            } else if (tags.match(/[^ \s]/g)) {
                tagsArr = tags.split(' ');
            }

            if (tagsArr.length === 0) {
                var videos = this.dataVideos.slice(offset, offset + this.limit);
                for (var i = 0; i < videos.length; i++) {
                    result.push('<div class="ajax-video' + (videos[i].src === this.src.url ? ' chosen ' : '') + '" data-src="' + videos[i].src + '" data-preview="' + videos[i].preview + '" style="background-image: url(' + videos[i].preview + ');"></div>');
                }
            } else {
                var dataSearchVideos = [];
                for (var y = 0; y < this.dataVideos.length; y++) {
                    for (var j = 0; j < tagsArr.length; j++) {
                        if (tagsArr[j] !== '' && this.dataVideos[y].tags.indexOf(tagsArr[j]) != -1) {
                            if (dataSearchVideos.indexOf(this.dataVideos[y]) == -1) {
                                dataSearchVideos.push(this.dataVideos[y]);
                            }
                        }
                    }
                }

                // Videos count by tags
                this.numberFoundByTagsVideos = dataSearchVideos.length;

                var searchVideos = dataSearchVideos.slice(offset, offset + this.limit);
                for (var x = 0; x < searchVideos.length; x++) {
                    result.push('<div class="ajax-video' + (searchVideos[x].src === this.src.url ? ' chosen ' : '') + '" data-src="' + searchVideos[x].src + '" data-preview="' + searchVideos[x].preview + '" style="background-image: url(' + searchVideos[x].preview + ');"></div>');
                }
            }

            return result.join('');
        },
        showAllSearchResult: function() {
            if (!this.$el.find('.search-result-all').is(':visible')) {
                this.$el.find('.search-result-all').show();
                this.$el.find('.search-result-all .search-result__digit').html(this.dataVideos.length);
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
         * Keyup event for filtering videos by tags in search input
         * @param {type} evt
         */
        searchFilter: function() {
            var self = this;

            var groupTags = [],
                data = this.dataVideos;

            for (var i = 0; i < data.length; i++) {
                if (!_.isUndefined(data[i].tags)) {
                    groupTags.push(data[i].tags);
                }
            }

            var tagsList = _.union(_.flatten(groupTags));

            this.$el.find('.video-search').autocomplete({
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
         * Render VideoCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(_.template(this.storage.getSkinTemplate('field-video-setting-preview'))({
                'hideDeleteButton': this.settings.hideDeleteButton,
                'search': this.storage.__('search', 'Search'),
                'back': this.storage.__('back', 'Back'),
                'text_results': this.storage.__('results', 'Results'),
                'text_all_videos': this.storage.__('allVideos', 'All videos'),
                'no_search_result': this.storage.__('noResult', 'No results'),
                'src': this.src,
                'tags': this.tags
            }));

            return this;
        },
        /**
         * Actions to do after element is rendered 
         */
        afterRender: function() {
            var self = this;

            //Inserting tags if such existed
            if (!!this.tags) {
                this.$el.find('.video-search').val(this.tags);
            }

            this.search();

            this.$el.find('.filtered-videos').on('scroll', function() {
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
        },
    });