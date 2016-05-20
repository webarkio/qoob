/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var VideoCenterView = Backbone.View.extend(
        /** @lends BuilderView.prototype */{
            className: "settings menu-block",
            parentId: null,
            events: {
                'click .backward-image': 'backward',
                'click #inner-settings-video .ajax-video': 'selectVideo',
                'click #inner-settings-video .ajax-video.chosen': 'unselectVideo',
                'keyup #inner-settings-video .video-search': 'searchFilter',
                'change #inner-settings-video .video-pack': 'categoryChange',
                'click .delete-video': 'deleteVideo',
                'click .video-url-select' : 'selectCustomVideo'
            },
            /**
             * Set setting's id
             * @class SettingsView
             * @augments Backbone.View
             * @constructs
             */
            attributes: function () {
                return {
                    id: "settings-block-media"
                };
            },
            /**
             * View buider
             * @class BuilderView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                this.storage = options.storage;
                this.controller = options.controller;
                this.tpl = _.template(this.storage.builderTemplates['field-video-setting-preview']);
                this.parentId = options.parentId;
                this.backId = (options.parentId === undefined) ? "settings-block-" + this.model.id : "settings-block-" + options.parentId;
                this.curSrc = options.curSrc;
                this.assets = options.assets;
                this.tags = options.tags;
            },
            /**
             * Render builder view
             * @returns {Object}
             */
            render: function () {
                var assets = this.assets,
                        videos = [];
                //Getting info about all video assets
                for (var i = 0; i < assets.length; i++) {
                    for (var j = 0; j < assets[i].length; j++) {
                        if (assets[i][j].type === 'video') {
                            videos.push({
                                valueClean: assets[i][j].src,
                                value: Fields.video.prototype.videoUrl(assets[i][j].src),
                                pack: assets[i][j].pack,
                                tags: assets[i][j].tags
                            });
                        }
                    }
                }
                //Creating layout
                this.$el.html(this.tpl({
                    videos: videos
                }));

                this.afterRender();

                return this;
            },
            /**
             * Actions to do after element is rendered 
             *
             */
            afterRender: function () {
                var assets = this.assets,
                        packs = [];

                for (var i = 0; i < assets.length; i++) {
                    for (var j = 0, asset = assets[i]; j < asset.length; j++) {
                        if (asset[j].type === 'video') {
                            //Getting packs
                            var pack = asset[j].pack || 'default';
                            if (!_.contains(packs, pack)) {
                                packs.push(pack);
                                this.$el.find('.video-pack').append('<option value="' + pack + '">' + pack + '</option>');
                            }
                        }
                    }
                }
                //Inserting tags if such existed
                if (!!this.tags) {
                    this.$el.find('.video-search').val(this.tags);
                    this.$el.find('.video-search').trigger('keyup');
                }
                //Initialize select picker
                this.$('.video-pack').selectpicker();
            },
            /**
             * Remove view
             */
            dispose: function () {
                // same as this.$el.remove();
                this.$el.remove();
                // unbind events that are
                // set on this view
                this.off();
            },
            /**
             * Returning to main block settings on clicking back button
             * @returns {undefined}
             */
            backward: function () {
                this.controller.layout.menu.rotate(this.backId);
            },
            /**
             * Setting an image by clicking it
             * @param {type} evt
             * @returns {undefined}
             */
            selectVideo: function (evt) {
                this.$el.find('.ajax-video').removeClass('chosen');
                evt.currentTarget.classList.add('chosen');
                window.selectFieldVideo(this.$(evt.currentTarget).find('iframe').attr('data-clean-src'));
            },
            /**
             * Unset the chosen image and returning to the default one
             */
            unselectVideo: function (evt) {
                this.$el.find('.ajax-video').removeClass('chosen');
                evt.currentTarget.classList.remove('chosen');
                window.selectFieldVideo(this.curSrc);
            },
            /**
             * Delete image
             * @param {type} evt
             */
            deleteVideo: function (evt) {
                window.selectFieldVideo('empty');
                this.controller.layout.menu.rotate(this.backId);
            },
            /**
             * Keyup event for filtering images by tags in search input
             * @param {type} evt
             */
            searchFilter: function (evt) {
                var self = this,
                        filteredWords = evt.target.value.split(','),
                        imagesToFilter = this.$el.find('.ajax-video');

                imagesToFilter.stop(true, true).fadeIn();

                if (filteredWords.length <= 1 && filteredWords[0] === '') {
                    imagesToFilter.stop(true, true).fadeIn();
                } else {
                    imagesToFilter.each(function () {
                        var filtered = false;
                        for (var i = 0; i < filteredWords.length; i++) {
                            var regEx = new RegExp(filteredWords[i].replace(/ /g, ' *'));
                            if (filteredWords[i] !== '' && this.getAttribute('data-video-tags').match(regEx)) {
                                filtered = true;
                                self.$(this).stop(true, true).fadeIn();
                                break;
                            }
                        }
                        if (!filtered) {
                            //Question: first time fadeOut() doesn't work, but hide() dose
                            self.$(this).stop(true, true).fadeOut().hide();
                        }
                    });
                }
            },
            /**
             * Filtering videos by category select controller
             * @param {type} evt
             * @returns {undefined}
             */
            categoryChange: function (evt) {
                var pack = evt.target.value,
                        videosToFilter = this.$el.find('.ajax-video');

                videosToFilter.removeClass('not-in-pack');

                if (pack !== 'all') {
                    videosToFilter.each(function () {
                        if (pack !== this.getAttribute('data-video-pack')) {
                            this.classList.add('not-in-pack');
                        }
                    });
                }

                this.$el.find('.video-search').trigger('keyup');
            },
            /**
             * Upload video by inserted link
             * @param {type} evt
             * @returns {undefined}
             */
            selectCustomVideo: function (evt) {
                this.$el.find('.ajax-video chosen').removeClass('chosen');
                window.selectFieldVideo(this.$(evt.currentTarget).siblings()[0].value || this.curSrc);
            }
        });