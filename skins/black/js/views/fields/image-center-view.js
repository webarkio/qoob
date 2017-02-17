/*global window*/
/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var ImageCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends ImageCenterView.prototype */
    {
        className: "settings menu-block",
        dataImages: [],
        limit: 12,
        stepScroll: 0,
        events: {
            'click .backward-image': 'backward',
            'click #inner-settings-image .ajax-image': 'selectImage',
            // 'click #inner-settings-image .ajax-image.chosen': 'unselectImage',
            'keyup #inner-settings-image .img-search': 'searchFilter',
            // 'change #inner-settings-image .img-pack': 'categoryChange',
            'click .remove': 'deleteImage',
            // 'inview .inview-images': 'test'
            // 'click .img-url-select': 'imgUrlUpload',
            // 'change .img-url': 'imgUrlChange'
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
            this.storage = options.storage;
            this.controller = options.controller;
            this.tpl = _.template(this.storage.getSkinTemplate('field-image-setting-preview'));
            // this.parentId = options.parentId;
            this.backId = (options.parentId === undefined) ? this.model.id : options.parentId;
            this.curSrc = options.curSrc;
            this.assets = options.assets;
            this.tags = options.tags;
            this.hideDeleteButton = options.hideDeleteButton;

        },
        /**
         * Render ImageCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(this.tpl({
                curSrc: this.curSrc,
                assets: this.assets,
                hideDeleteButton: this.hideDeleteButton,
                back: this.storage.__('back', 'Back'),
                search: this.storage.__('search', 'Search'),
                'no_image': this.storage.__('no_image', 'No image'),
            }));

            this.afterRender();

            return this;
        },
        /**
         * Actions to do after element is rendered 
         *
         */
        afterRender: function() {
            var assets = this.assets;

            //Inserting tags if such existed
            if (!!this.tags) {
                this.$el.find('.img-search').val(this.tags);
                this.$el.find('.img-search').trigger('keyup');
            }

            for (var i = 0; i < assets.length; i++) {
                for (var j = 0, asset = assets[i]; j < asset.length; j++) {
                    if (asset[j].type === 'image') {
                        this.dataImages.push({ src: assets[i][j].src, tags: assets[i][j].tags });
                    }
                }
            }

            this.loadImages();
        },
        /*
        test: function(event, isInView) {
            console.log('tut');
            var self = this,
                tags = this.tags,
                filteredImages = this.$el.find('.filtered-images');


            if (isInView) {
                console.log('isInView');

                filteredImages.find('.inview-images').before(self.getImages(tags));
                filteredImages.find('.inview-images').trigger('inview');

                // element is now visible in the viewport
            } else {
                console.log('ne vizhu');
                // element has gone out of viewport
            }

        },
        */
        /**
         * Load images
         * @returns {String} html
         */
        loadImages: function() {
            var self = this,
                tags = this.tags,
                filteredImages = this.$el.find('.filtered-images');

            var images = self.getImages(tags);

            this.$el.find('.inview-images').on('inview', function(event, isInView) {
                if (isInView && images) {
                    console.log('isInView');
                    filteredImages.find('.inview-images').before(images);
                    self.loadImages();
                    // element is now visible in the viewport
                } else {
                    console.log('element has gone out of viewport');
                    // element has gone out of viewport
                }
            });

            // var currPage = 0,
            //     itemsInPage = 100,
            //     items = [],
            //     scrollTimeout = 0;
            // for (var i = 0; i < 1000; i++) items.push(i + 1);
            // window.onscroll = function() { 
            //     clearTimeout(scrollTimeout);
            //     scrollTimeout = setTimeout(function() { 
            //         items.forEach(function(item, index) {
            //             if (currPage >= Math.ceil(items.length / itemsInPage))
            //                 currPage = 0;

            //             var startItem = currPage * itemsInPage;
            //             var endItem = startItem + itemsInPage;
            //             if (index >= startItem && index < endItem)
            //                 console.log(item); 
            //         });
            //         currPage++; 
            //     }, 250);
            // };
        },

        getImages: function(tags) {
            var limit = 12;

            var filteredWords = tags,
                data = this.dataImages,
                imgs = [];

            var paginate = function(step) {
                var start = limit * step;
                return data.slice(start, start + limit);
            }

            var images = paginate(this.stepScroll);

            images.forEach(function(item) {
                imgs.push('<div class="ajax-image"><img src="' + item.src + '" alt="" /></div>');
            });

            this.stepScroll++;

            // for (var i = 0; i < data.length; i++) {
            //     if (filteredWords.length <= 1 && filteredWords[0] === '') {
            //         for (var j = 0; j < filteredWords.length; j++) {
            //             var regEx = new RegExp(filteredWords[j].replace(/ /g, ' *'));
            //             if (filteredWords[j] !== '' && data[j].join(' ').tags.match(regEx)) {
            //                 console.log(1);
            //                 // filtered = true;
            //                 // self.$(this).stop(true, true).fadeIn();
            //                 break;
            //             }
            //         }
            //     } else {
            //         imgs.push('<div class="ajax-image"><img src="' + data[i].src + '" alt="" /></div>');
            //     }
            // }

            return imgs.join('');
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
         * Setting an image by clicking it
         * @param {type} evt
         * @returns {undefined}
         */
        selectImage: function(evt) {
            this.$el.find('.ajax-image').removeClass('chosen');
            evt.currentTarget.classList.add('chosen');
            window.selectFieldImage(evt.target.getAttribute('src'));
        },
        /**
         * Unset the chosen image and returning to the default one
         */
        // unselectImage: function (evt) {
        //     this.$el.find('.ajax-image').removeClass('chosen');
        //     evt.currentTarget.classList.remove('chosen');
        //     window.selectFieldImage(this.curSrc);
        // },
        /**
         * Delete image
         * @param {type} evt
         */
        deleteImage: function(evt) {
            evt.preventDefault();
            window.selectFieldImage('');
            this.$el.find('.selected-image').addClass('empty');

            // this.controller.layout.menu.rotate(this.backId);
        },
        /**
         * Keyup event for filtering images by tags in search input
         * @param {type} evt
         */
        searchFilter: function(evt) {
            var assets = this.assets,
                filteredImages = this.$el.find('.filtered-images'),
                filteredWords = evt.target.value.split(',');

            filteredImages.empty();

            // console.log(assets);

            var imgs = [];
            if (filteredWords.length <= 1 && filteredWords[0] === '') {

            } else {
                for (var i = 0; i < assets.length; i++) {
                    for (var j = 0, asset = assets[i]; j < asset.length; j++) {
                        if (asset[j].type === 'image') {
                            imgs.push('<div class="ajax-image"><img src="' + assets[i][j].src + '" alt="" /></div>');
                        }
                    }
                }
                filteredImages.append(imgs.join(''));
            }



            // var self = this,

            //     imagesToFilter = this.$el.find('.ajax-image');

            // imagesToFilter.stop(true, true).fadeIn();

            // if (filteredWords.length <= 1 && filteredWords[0] === '') {
            //     imagesToFilter.stop(true, true).fadeIn();
            // } else {
            //     imagesToFilter.each(function() {
            //         var filtered = false;
            //         for (var i = 0; i < filteredWords.length; i++) {
            //             var regEx = new RegExp(filteredWords[i].replace(/ /g, ' *'));
            //             if (filteredWords[i] !== '' && this.getAttribute('data-image-tags').match(regEx)) {
            //                 filtered = true;
            //                 self.$(this).stop(true, true).fadeIn();
            //                 break;
            //             }
            //         }
            //         if (!filtered) {
            //             //Question: first time fadeOut() doesn't work, but hide() dose
            //             self.$(this).stop(true, true).fadeOut().hide();
            //         }
            //     });
            // }
        },
        /**
         * Remove view
         */
        dispose: function() {
            this.$el.remove();
            // unbind events that are
            // set on this view
            this.off();
        },
        /**
         * Filtering images by category select controller
         * @param {type} evt
         * @returns {undefined}
         */
        /*categoryChange: function (evt) {
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
        }*/
    });
