var Fields = Fields || {};

/**
 * View field image
 */
Fields.video = FieldView.extend(
        /** @lends Fields.image.prototype */{
            events: {
                'change input': 'changeInput',
                'click .edit-video': 'videoUpload',
                'click .other-video': 'changeVideo'
            },
            /**
             * View field image
             * @class Fields.image
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                FieldView.prototype.initialize.call(this, options);
                this.tags = options.settings.tags || null;
                this.tpl = _.template(this.storage.builderTemplates['field-video-preview']);
            },
            /**
             * Event change input
             * @param {Object} evt
             */
            changeInput: function (evt) {
                this.model.set(this.$(evt.target).attr('name'), this.$el.find('.edit-video iframe').attr('data-clean-src'));
            },
            /**
             * Image upload
             * @param {Object} evt
             */
            videoUpload: function (evt) {
                var assets = this.storage.getAssets();

                window.selectFieldVideo = function (cleanSrc) {
                    if (cleanSrc) {
                        var src;
                        if (cleanSrc === 'empty') {
                            src = cleanSrc;
                            this.$el.find('.edit-video').addClass(cleanSrc);
                        } else {
                            src = this.videoUrl(cleanSrc);
                        }
                        this.$el.find('.edit-video iframe').attr({'src': src, 'data-clean-src': cleanSrc});
                        this.$el.find('input').trigger("change");
                        if (this.$el.find('.other-videos').length) {
                            this.$el.find('.other-video').removeClass('active');
                        }
                    }
                }.bind(this);

                var videoCenter = new VideoCenterView({
                    model: this.model,
                    controller: this.controller,
                    parentId: this.model.owner_id,
                    storage: this.storage,
                    curSrc: this.$el.find('.edit-video').find('iframe').attr('data-clean-src'),
                    assets: assets,
                    tags: this.tags
                });

                this.controller.setInnerSettingsView(videoCenter);

                return false;
            },
            /**
             * Change other video
             * @param {Object} evt
             */
            changeVideo: function (evt) {
                var elem = this.$(evt.currentTarget);
                this.$el.find('.other-video').removeClass('active');
                elem.addClass('active');
                this.$el.find('.edit-video iframe').attr({'src': elem.find('iframe').attr('src'), 'data-clean-src': elem.find('iframe').attr('data-clean-src')});
                this.$el.find('.edit-video').removeClass('empty');
                this.$el.find('input').trigger("change");
            },
            /**
             * Render filed image
             * @returns {Object}
             */
            render: function () {
                var htmldata = {
                    label: this.settings.label,
                    name: this.settings.name,
                    videosClean: this.settings.videos,
                    valueClean: this.getValue(),
                    videos: this.settings.videos.map(function (video) {
                        return this.videoUrl(video);
                    }.bind(this)),
                    value: this.getValue() === 'empty' ? this.getValue() : this.videoUrl(this.getValue())
                };

                if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
                    this.$el.html(this.tpl(htmldata));
                }

                return this;
            },
            /**
             * Create acceptable url for video link
             * @param {type} url Video share link
             * @returns {String} Acceptable url for iframe
             */
            videoUrl: function (url) {
                if (url) {
                    var url_split = url.split(/[/]/);
                    var id_video = url.substr(url.indexOf('=') + 1, url.length);

                    var typeVideo = "";
                    if (url_split[2] == 'youtu.be') {
                        typeVideo = "//www.youtube.com/embed/" + url_split[url_split.length - 1];
                    } else if (url_split[2] == 'www.youtube.com') {
                        typeVideo = "//www.youtube.com/embed/" + id_video;
                    } else {
                        typeVideo = "//player.vimeo.com/video/" + url_split[url_split.length - 1];
                        typeVideo = typeVideo + "?color=ffffff&title=0&portrait=0";
                    }
                    url = typeVideo;
                }
                return url;
            }
        });
