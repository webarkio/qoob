/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var MediaCenterView = Backbone.View.extend(
        /** @lends BuilderView.prototype */{
            tagName: "div",
            className: "settings menu-block",
            tpl: null,
            parentId: null,
            events: {
                'click .backward-image': 'backward',
                'click #inner-settings-image .ajax-image': 'choseImage',
                'keyup #inner-settings-image .img-search': 'searchFilter',
                'change #inner-settings-image .img-pack': 'categoryChange'
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
                this.tpl = _.template(this.storage.builderTemplates['field-image-setting-preview']);
                this.parentId = options.parentId;
                this.blockId = options.blockId;
                this.backId = "settings-block-" + this.model.id;
                this.curSrc = options.curSrc;
                this.assets = options.assets;

                this.render();
            },
            /**
             * Render builder view
             * @returns {Object}
             */
            render: function () {
                //Creating layout
                this.$el.html(this.tpl({
                    "curSrc": this.curSrc,
                    "assets": this.assets
                }));

                this.afterRender();

                return this;
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
            choseImage: function (evt) {
                var chosen = this.$el.find('.chosen').find('img');
                this.$el.find('.ajax-image').removeClass('chosen');
                evt.currentTarget.classList.add('chosen');
                window.selectFieldImage(evt.target.getAttribute('src'));
            },
            /**
             * Keyup event for filtering images in search input
             * @param {type} evt
             * @returns {undefined}
             */
            searchFilter: function (evt) {
                var self = this,
                        filteredWords = evt.target.value.split(' '),
                        imagesToFilter = this.$el.find('.ajax-image');

                imagesToFilter.stop(true, true).fadeIn();

                if (filteredWords.length <= 1 && filteredWords[0] === '') {
                    imagesToFilter.stop(true, true).fadeIn();
                } else {
                    imagesToFilter.each(function () {
                        var filtered = false;
                        for (var i = 0; i < filteredWords.length; i++) {
                            if (filteredWords[i] !== '' && this.getAttribute('data-image-tags').match(new RegExp(filteredWords[i]))) {
                                filtered = true;
                                self.$(this).stop(true, true).fadeIn();
                                break;
                            }
                        }
                        if (!filtered) {
                            self.$(this).stop(true, true).fadeOut();
                        }
                    });
                }
            },
            /**
             * Filtering images by category select controller
             * @param {type} evt
             * @returns {undefined}
             */
            categoryChange: function (evt) {
                var pack = evt.target.value,
                        imagesToFilter = this.$el.find('.ajax-image');

                imagesToFilter.removeClass('not-in-pack');

                if (pack !== 'all') {
                    imagesToFilter.each(function () {
                        if (pack !== this.getAttribute('data-image-pack')) {
                            this.classList.add('not-in-pack');
                        }
                    });
                }

                this.$el.find('.img-search').trigger('keyup');
            },
            afterRender: function () {
                var assets = this.assets,
                        tags = [],
                        packs = [];

                for (var i = 0; i < assets.length; i++) {
                    for (var j = 0, asset = assets[i]; j < asset.length; j++) {
                        if (asset[j].type === 'image') {
                            //Getting packs
                            var pack = asset[j].pack || 'default';
                            if (!_.contains(packs, pack)) {
                                packs.push(pack);
                                this.$el.find('.img-pack').append('<option value="' + pack + '">' + pack + '</option>');
                            }
                            //Getting current block image tags to paste them in filter
                            if (this.curSrc === asset[j].src && asset[j].tags) {
                                tags = tags.concat(asset[j].tags);
                            }
                        }
                    }
                }

                //Inserting tags if such existed
                if (tags.length > 0) {
                    var tagLine = tags.join(' ');
                    this.$el.find('.img-search').val(tagLine).trigger('keyup');
                }
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
            }
        });