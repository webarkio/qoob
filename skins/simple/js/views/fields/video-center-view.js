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
        events: {
            'keydown': 'keyAction',
            'click .ajax-video': 'clickListVideo',
            'keyup .video-search': 'searchFilter',
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
            this.name = options.name;
            this.side = options.side;
            this.storage = options.storage;
            this.controller = options.controller;
            this.tpl = _.template(this.storage.getSkinTemplate('field-video-setting-preview'));
            this.src = options.src;
            this.assets = options.assets;
            this.tags = options.tags;
            this.cb = options.cb;
            this.parent = options.parent;


            this.listenTo(this.model, 'change',  function(select){
                var video = Object.keys(select.changed)[0];
                this.changeVideo({'url': select.changed[video].url, 'preview': select.changed[video].preview});
            });


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
                search: this.storage.__('search', 'Search'),
                src: this.src
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
                this.search();
                this.$el.find('.video-search').autocomplete("search", "");
                return false;
            }
        },
        search: function() {
            var filteredWords = this.$el.find('.video-search').val().split(','),
                filteredVideos = this.$el.find('.filtered-videos');

            filteredVideos.find('.ajax-video').remove();

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
                filteredWords = filteredWords.join('').split(' ');
            }

            if ((filteredWords.length <= 1 && filteredWords[0] === '') || !filteredWords) {
                var videos = this.dataVideos.slice(offset, offset + this.limit);
                for (var i = 0; i < videos.length; i++) {
                    result.push('<div class="ajax-video' + (videos[i].src === this.src.url ? ' chosen ' : '') + '" data-src="' + videos[i].src + '" data-preview="' + videos[i].preview + '" style="background-image: url(' + videos[i].preview + ');"></div>');
                }
            } else {
                var dataSearchVideos = [];
                for (var y = 0; y < this.dataVideos.length; y++) {
                    for (var j = 0; j < filteredWords.length; j++) {
                        var regEx = new RegExp(filteredWords[j].replace(/ /g, ''));
                        if (filteredWords[j] !== '' && (this.dataVideos[y].tags && this.dataVideos[y].tags.join(' ').match(regEx))) {
                            if (dataSearchVideos.indexOf(this.dataVideos[y]) < 0) {
                                dataSearchVideos.push(this.dataVideos[y]);
                            }
                        }
                    }
                }

                var searchVideos = dataSearchVideos.slice(offset, offset + this.limit);
                for (var x = 0; x < searchVideos.length; x++) {
                    result.push('<div class="ajax-video' + (searchVideos[x].src === this.src.url ? ' chosen ' : '') + '" data-src="' + searchVideos[x].src + '" data-preview="' + searchVideos[x].preview + '" style="background-image: url(' + searchVideos[x].preview + ');"></div>');
                }
            }

            return result.join('');
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

            var src = {'url': url, 'preview': preview};

            this.changeVideo({'url': url, 'preview': preview});

            this.cb(src);
        },
        changeVideo: function(src) {
            this.$el.find('.field-video__selected-video img').attr('src', src.preview);

            if (this.$el.find('.field-video-container-inner').hasClass('empty')) {
                this.$el.find('.field-video-container-inner').removeClass('empty');
            }

            this.$el.find('.ajax-video').removeClass('chosen');
            this.src = src;
            this.search();
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