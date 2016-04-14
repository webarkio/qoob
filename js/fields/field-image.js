var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = Backbone.View.extend(
        /** @lends Fields.image.prototype */{
            className: "settings-item",
            events: {
                'change input': 'changeInput',
                'click input': 'imageUpload',
                'click .cross-delete': 'deleteImage',
                'click .other-photo': 'changeImage'
            },
            /**
             * View field image
             * @class Fields.image
             * @augments Backbone.View
             * @constructs
             */
            initialize: function () {
            },
            /**
             * Event change input
             * @param {Object} evt
             */
            changeInput: function (evt) {
                var target = jQuery(evt.target);
                this.model.set(target.attr('name'), target.prev().find('img').attr('src'));
            },
            /**
             * Get value field image
             * @returns {String}
             */
            getValue: function () {
                return this.model.get(this.config.name) || this.config.default;
            },
            /**
             * Image upload
             * @param {Object} evt
             */
            imageUpload: function (evt) {
                var blockId = jQuery(evt.target).closest('.settings.menu-block').attr('id').match(new RegExp(/(\d)+/))[0];
                var markup = '';
                var blockItems = builder.storage.builderData.items;
                var assets = [];

                window.selectFieldImage = function (src) {
                    var img = jQuery(evt.target).prev().find('img');
                    if (src && src != '') {
                        img.attr('src', src);
                        jQuery(evt.target).trigger("change");
                    }
                };

                for (var i = 0, lng = blockItems.length; i < lng; i++) {
                    if (!!blockItems[i].config.assets) {
                        assets.push(blockItems[i].config.assets);
                    }
                }

                markup = Fields.image.prototype.createAssetsMarkup(blockId, assets);
                builder.menu.showInnerSettings(blockId, markup);


                return false;
            },
            /**
             * Creating media center imagea preview markup 
             * @param {string} blockId Id of the current block
             * @param {Array} assets Assets object from all config files
             * @returns {String} Resulted markup
             */
            createAssetsMarkup: function (blockId, assets) {
                var imagesMarkup = '';
                var markup;

                for (var i = 0; i < assets.length; i++) {
                    for (var j = 0; j < assets[i].length; j++) {
                        if (assets[i][j].type === 'image') {
                            imagesMarkup += '<div class="ajax-image" data-image-tags="' + (assets[i][j].tags ? assets[i][j].tags.join() : '') + '">' +
                                    '<img src="' + assets[i][j].src + '" alt="" />' +
                                    '</div>';
                        }
                    }
                }

                markup = '<div id="inner-settings-image" class="inner-settings">' +
                        '<div class="backward">' +
                        '<a onclick="builder.menu.showSettings(' + blockId + '); return false;" href="#">Back</a>' +
                        '</div>' +
                        '<input class="input-text img-search" type="text" placeholder="Filter">' +
                        '<input class="no-active img-select" type="button" value="Select image">' +
                        '<div class="settings-block settings-scroll">' +
                        '<div class="filtered-images">' + imagesMarkup + '</div>' +
                        '</div>' +
                        '</div>';

                markup += "<script type='text/javascript'>" +
                        "jQuery(document).ready(function() {" +
                        "jQuery('.img-search').keyup(function(e) {" +
                        "var filteredWords = jQuery(this).val().split(' ');" +
                        "var imagesToFilter = jQuery('#inner-settings-image .ajax-image');" +
                        "imagesToFilter.stop(true, true).fadeIn();" +
                        "if(filteredWords.length <= 1 && filteredWords[0] === '') {" +
                        "imagesToFilter.stop(true, true).fadeIn();" +
                        "} else {" +
                        "imagesToFilter.each(function() {" +
                        "var filtered = false;" +
                        "for(var i = 0; i < filteredWords.length; i++) {" +
                        "if(filteredWords[i] !== '' && jQuery(this).attr('data-image-tags').match(new RegExp(filteredWords[i]))) {" +
                        "filtered = true;" +
                        "jQuery(this).stop(true, true).fadeIn();" +
                        "break;" +
                        "}" +
                        "}" +
                        "if(!filtered) {" +
                        "jQuery(this).stop(true, true).fadeOut();" +
                        "}" +
                        "});" +
                        "}" +
                        "});" +
                        "jQuery('#inner-settings-image .ajax-image').click(function() {" +
                        "jQuery('#inner-settings-image .ajax-image').removeClass('chosen');" +
                        "jQuery('#inner-settings-image .img-select').removeClass('no-active');" +
                        "jQuery(this).addClass('chosen');" +
                        "});" +
                        "jQuery('#inner-settings-image .img-select').click(function() {" +
                        "var url;" +
                        "var chosen = jQuery('#inner-settings-image .chosen img');" +
                        "if(chosen.get(0)) {" +
                        "url = chosen.attr('src');" +
                        "window.selectFieldImage(url);" +
                        "builder.menu.showSettings(" + blockId + ");" +
                        "}" +
                        "});" +
                        "});" +
                        "</script>";
                return markup;
            },
            /**
             * Delete image
             * @param {type} evt
             */
            deleteImage: function (evt) {
                jQuery(evt.target).hide();
                var item = jQuery(evt.target).parents('.settings-item');
                var name = item.find('input').prop('name');
                item.find('edit-image > img').attr('src', '');
                item.find('.edit-image').hide();
                if (this.$el.find('.other-photos').length) {
                    this.$el.find('.other-photo').removeClass('active');
                }
                this.model.set(name, '');
            },
            /**
             * Get other photos
             * @returns {String}
             */
            getOherPhotos: function () {
                var images = '';
                for (var i = 0; i < this.config.images.length; i++) {
                    images += '<div class="other-photo ' + (this.config.images[i] == this.getValue() ? 'active' : '') + '"><img src="' + this.config.images[i] + '"></div>';
                }
                return '<div class="other-photos">' + images + '</div>';
            },
            /**
             * Change other image
             * @param {Object} evt
             */
            changeImage: function (evt) {
                var elem = jQuery(evt.currentTarget);
                this.$el.find('.other-photo').removeClass('active');
                elem.addClass('active');
                this.$el.find('.edit-image img').attr('src', elem.find('img').attr('src'));
                this.$el.find('input').trigger("change");
                if (!this.$el.find('.edit-image').is(":visible")) {
                    this.$el.find('.edit-image').show();
                }
            },
            /**
             * Create filed image
             * @returns {String}
             */
            create: function () {
                return '<div class="title"><div class="text">' + this.config.label + '</div>' +
                        '<div class="cross-delete"><a href="#"></a></div></div>' +
                        (this.config.images ? this.getOherPhotos() : '') +
                        '<div class="edit-image"><img src="' + this.getValue() + '" /></div>' +
                        '<input name="' + this.config.name + '" class="btn-upload btn-builder" type="button" value="Media Center" />';
            },
            /**
             * Render filed image
             * @returns {Object}
             */
            render: function () {
                if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
                    this.$el.html(this.create());
                }
                return this;
            }
        });