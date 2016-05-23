/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var MediaCenterView = Backbone.View.extend(
        /** @lends BuilderView.prototype */{
            className: "settings menu-block",
            parentId: null,
            events: {
                'click .backward-image': 'backward',
                'click #inner-settings-image .ajax-image': 'selectImage',
                'click #inner-settings-image .ajax-image.chosen': 'unselectImage',
                'keyup #inner-settings-image .img-search': 'searchFilter',
                'change #inner-settings-image .img-pack': 'categoryChange',
                'click .delete-image': 'deleteImage',
                'click .img-url-select': 'imgUrlUpload',
                'change .img-url': 'imgUrlChange'
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
                //Creating layout
                this.$el.html(this.tpl({
                    curSrc: this.curSrc,
                    assets: this.assets
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
                        if (asset[j].type === 'image') {
                            //Getting packs
                            var pack = asset[j].pack || 'default';
                            if (!_.contains(packs, pack)) {
                                packs.push(pack);
                                this.$el.find('.img-pack').append('<option value="' + pack + '">' + pack + '</option>');
                            }
                        }
                    }
                }
                //Inserting tags if such existed
                if (!!this.tags) {
                    this.$el.find('.img-search').val(this.tags);
                    this.$el.find('.img-search').trigger('keyup');
                }
                //Initialize select picker
                this.$('.img-pack').selectpicker();
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
            selectImage: function (evt) {
                this.$el.find('.ajax-image').removeClass('chosen');
                evt.currentTarget.classList.add('chosen');
                window.selectFieldImage(evt.target.getAttribute('src'));
            },
            /**
             * Unset the chosen image and returning to the default one
             */
            unselectImage: function (evt) {
                this.$el.find('.ajax-image').removeClass('chosen');
                evt.currentTarget.classList.remove('chosen');
                window.selectFieldImage(this.curSrc);
            },
            /**
             * Delete image
             * @param {type} evt
             */
            deleteImage: function (evt) {
                window.selectFieldImage('empty');
                this.controller.layout.menu.rotate(this.backId);
            },
            /**
             * Keyup event for filtering images by tags in search input
             * @param {type} evt
             */
            searchFilter: function (evt) {
                var self = this,
                        filteredWords = evt.target.value.split(','),
                        imagesToFilter = this.$el.find('.ajax-image');

                imagesToFilter.stop(true, true).fadeIn();

                if (filteredWords.length <= 1 && filteredWords[0] === '') {
                    imagesToFilter.stop(true, true).fadeIn();
                } else {
                    imagesToFilter.each(function () {
                        var filtered = false;
                        for (var i = 0; i < filteredWords.length; i++) {
                            var regEx = new RegExp(filteredWords[i].replace(/ /g, ' *'));
                            if (filteredWords[i] !== '' && this.getAttribute('data-image-tags').match(regEx)) {
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
            /**
             * Insert inputed url into the model and trigger change
             * 
             */
            imgUrlUpload: function () {
                //Create media upload frame
                var mcFrame = wp.media({
                    title: 'Select or Upload Media Of Your Chosen Persuasion',
                    button: {
                        text: 'Use this media'
                    },
                    multiple: false  // Set to true to allow multiple files to be selected  
                });
                //On submit - save submitted url
                mcFrame.on('select', function () {
                    // Get media attachment details from the frame state
                    var attachment = mcFrame.state().get('selection').first().toJSON();         
                    this.$el.find('.img-url').val(attachment.url || '').trigger('change');
                }.bind(this));
                //Open media frame
                mcFrame.open();
            },
            /**
             * Check if input is not empty and update model.
             * Use default src if it's empty. 
             *
             */
            imgUrlChange: function () {
                window.selectFieldImage(this.$el.find('.img-url').val() || this.curSrc);
                this.$el.find('.ajax-image').removeClass('chosen');
            }
        });