var Fields = Fields || {};

/**
 * View field video
 */
Fields.video = QoobFieldView.extend(
        /** @lends Fields.video.prototype */{
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
                QoobFieldView.prototype.initialize.call(this, options);
                this.parentId = options.parentId;
                this.tags = options.settings.tags || null;
                this.tpl = _.template(this.storage.qoobTemplates['field-video-preview']);
            },
            /**
             * Event change input
             * @param {Object} evt
             */
            changeInput: function (evt) {
                this.model.set(this.$(evt.target).attr('name'), this.$el.find('.edit-video').attr('data-src'));
            },
            /**
             * Image upload
             * @param {Object} evt
             */
            videoUpload: function (evt) {
                var assets = this.storage.getAssets();

                window.selectFieldVideo = function (src) {
                    if (src) {
                        if (src === 'empty') {
                            this.$el.find('.edit-video').addClass(src);
                        } else {
                            this.$el.find('.edit-video').removeClass('empty');
                        }
                        this.$el.find('.edit-video').attr('data-src', src);
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
                    curSrc: this.$el.find('.edit-video').attr('data-src'),
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
                this.$el.find('.edit-video').attr('data-src', elem.attr('data-src'));
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
                    videos: this.settings.presets,
                    value: this.getValue()
                };

                if (typeof (this.settings.show) == "undefined" || this.settings.show(this.model)) {
                    this.$el.html(this.tpl(htmldata));
                }
                
                return this;
            }
        });
