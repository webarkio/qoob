/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var VideoCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends VideoCenterView.prototype */
    {
        className: "settings menu-block",
        dataVideos: null,
        dataSearchVideos: null,
        offset: 0,
        limit: 12,
        events: {
            'keydown': 'keyAction',
            'click .backward-video': 'backward',
            'click #inner-settings-video .ajax-video': 'selectVideo',
            'keyup #inner-settings-video .video-search': 'searchFilter',
            'click .remove': 'deleteVideo',
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
         * View VideoCenter
         * @class VideoCenterView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.controller = options.controller;
            this.tpl = _.template(this.storage.getSkinTemplate('field-video-setting-preview'));
            this.backId = (options.parentId === undefined) ? this.model.id : options.parentId;
            this.src = options.src;
            this.assets = options.assets;
            this.tags = options.tags;
            this.hideDeleteButton = options.hideDeleteButton;


            //Getting info about all video assets
            this.dataVideos = [];
            for (var i = 0; i < this.assets.length; i++) {
                for (var j = 0; j < this.assets[i].length; j++) {
                    if (this.assets[i][j].type === 'video') {
                        this.dataVideos.push({
                            src: this.assets[i][j].src,
                            pack: this.assets[i][j].pack,
                            tags: this.assets[i][j].tags,
                            title: this.assets[i][j].title ? this.assets[i][j].title : '',
                            preview: this.assets[i][j].preview ? this.assets[i][j].preview : ''
                        });
                    }
                }
            }
        },
        /**
         * Render VideoCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(this.tpl({
                back: this.storage.__('back', 'Back'),
                'no_video': this.storage.__('no_video', 'No video'),
                'no_poster': this.storage.__('no_poster', 'No poster'),
                search: this.storage.__('search', 'Search'),
                src: this.src,
                hideDeleteButton: this.hideDeleteButton
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
                this.$el.find('.video-search').val(this.tags);
            }

            this.loadMore();
            this.$el.find('.filtered-videos').on('scroll', function() {
                if (self.checkLoadMore()) {
                    self.loadMore();
                }
            });
        },
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.$el.find(".search-button").click();
                this.$el.find('.video-search').autocomplete('close');
                return false;
            }
        },
        clickSearchButton: function() {
            var filteredWords = this.$el.find('.video-search').val().split(','),
                filteredIcons = this.$el.find('.filtered-videos');

            filteredIcons.find('.ajax-video').remove();

            this.tags = filteredWords;
            this.offset = 0;
            this.loadMore();
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
            var filteredVideos = this.$el.find('.filtered-videos'),
                videos = this.getVideos(this.tags, this.offset);

            if (videos) {
                this.offset = this.offset + this.limit;
                filteredVideos.find('.inview-videos').before(videos);
                if (this.checkLoadMore()) {
                    this.loadMore();
                }
            }
        },
        getVideos: function(tags, offset) {
            var filteredWords = tags,
                result = [];

            if (_.isString(filteredWords)) {
                filteredWords = filteredWords.split(',');
            } else if (_.isArray(filteredWords)) {
                filteredWords = filteredWords.join('').split(',');
            }

            if ((filteredWords.length <= 1 && filteredWords[0] === '') || !filteredWords) {
                var videos = this.dataVideos.slice(offset, offset + this.limit);
                for (var i = 0; i < videos.length; i++) {
                    result.push('<div class="ajax-video" data-src="' + videos[i].src + '"><img src="' + videos[i].preview + '" alt="" /></div>');
                }
            } else {
                this.dataSearchVideos = [];
                for (var y = 0; y < this.dataVideos.length; y++) {
                    for (var j = 0; j < filteredWords.length; j++) {
                        var regEx = new RegExp(filteredWords[j].replace(/ /g, ' *'));
                        if (filteredWords[j] !== '' && (this.dataVideos[y].tags && this.dataVideos[y].tags.join(' ').match(regEx))) {
                            this.dataSearchVideos.push(this.dataVideos[y]);
                        }
                    }
                }

                var searchVideos = this.dataSearchVideos.slice(offset, offset + this.limit);
                for (var x = 0; x < searchVideos.length; x++) {
                    result.push('<div class="ajax-video" data-src="' + searchVideos[x].src + '"><img src="' + searchVideos[x].preview + '" alt="" /></div>');
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
         * Setting an video by clicking it
         * @param {type} evt
         * @returns {undefined}
         */
        selectVideo: function(evt) {
            if (evt.currentTarget.classList.contains('chosen')) {
                return;
            }
            this.$el.find('.ajax-video').removeClass('chosen');
            evt.currentTarget.classList.add('chosen');

            var url = this.$(evt.currentTarget).attr('data-src'),
                preview = this.$(evt.currentTarget).find('img').attr('src');

            this.$el.find('.video-container img').attr('src', preview);

            if (this.$el.find('.selected-video').hasClass('empty')) {
                this.$el.find('.selected-video').removeClass('empty');
            }
            window.selectFieldVideo({ url: url, preview: preview });
        },
        /**
         * Delete video
         * @param {type} evt
         */
        deleteVideo: function(evt) {
            evt.preventDefault();
            window.selectFieldVideo('');
            this.$el.find('.selected-video').addClass('empty');
            this.$el.find('.ajax-video').removeClass('chosen');
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
            // same as this.$el.remove();
            this.$el.remove();
            // unbind events that are
            // set on this view
            this.off();
        },
    });
