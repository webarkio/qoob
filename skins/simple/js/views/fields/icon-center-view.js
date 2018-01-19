/**
 * Create IconCenterView 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var IconCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends IconCenterView.prototype */
    {
        className: "inner-settings-icon settings inner-settings",
        offset: 0,
        limit: 12,
        numberFoundByTagsIcons: 0,
        showAllIcons: false,
        events: {
            'keydown': 'keyAction',
            'keyup .icon-search': 'searchFilter',
            'blur .icon-search': 'blurInput',
            'click .ajax-icon': 'clickListIcon',
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
                id: "settings-block-media",
                'data-side-id': 'settings-block-media'
            };
        },
        /**
         * View IconCenter
         * @class IconCenterView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.name = options.name;
            this.storage = options.storage;
            this.controller = options.controller;
            this.settings = options.settings;
            this.defaults = options.defaults;
            this.icons = options.icons;
            this.icon = options.icon;
            this.tags = options.icon.tags || '';
            this.model = options.model;
            this.parent = options.parent;
            this.cb = options.cb;

            this.listenTo(this.model, 'change', function(select) {
                var icon = Object.keys(select.changed)[0];
                this.changeIcon(select.changed[icon]);
            });
        },
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.search();
            } else if (evt.keyCode == 27) {
                this.hiddenFields();
            }
        },
        /**
         * Main method change icon
         * @param {String} icon
         */
        changeIcon: function(icon) {
            if (icon === undefined || icon == '') {
                if (!this.$el.find('.field-icon-container-inner').hasClass('empty')) {
                    this.$el.find('.field-icon-container-inner').addClass('empty');
                }
                this.$el.find('.field-icon__selected-icon span').attr({
                    'class': '',
                    'data-icon-tags': ''
                });
                this.$el.find('.icon-search').val('');

                this.tags = '';
                this.icon = '';
            } else {
                var iconObject = this.findByClasses(icon);

                this.tags = (iconObject ? iconObject.tags : '');

                this.$el.find('.field-icon-container-inner').removeClass('empty');

                this.$el.find('.field-icon__selected-icon span').attr({
                    'class': icon,
                    'data-icon-tags': this.tags
                });

                this.icon = { classes: icon, tags: this.tags };
            }

            this.selectIcon(this.icon);
        },
        selectIcon: function(icon) {
            this.$el.find('.ajax-icon').removeClass('chosen');
            if (icon !== '') {
                var filteredIcons = this.$el.find('.filtered-icons');
                filteredIcons.find("[class='" + icon.classes + "']").parent().addClass('chosen');
            }
        },
        clickBackward: function() {
            this.controller.backward();
        },
        /**
         * Setting an icon by clicking it
         * @param {type} evt
         * @returns {undefined}
         */
        clickListIcon: function(evt) {
            if (evt.currentTarget.classList.contains('chosen')) {
                return false;
            }

            var currentTarget = this.$(evt.currentTarget).find('span');

            this.icon = { classes: currentTarget.attr('class'), tags: currentTarget.data('iconTags') };
            this.cb(currentTarget.attr('class'));
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
         * Remove image
         */
        clickRemove: function() {
            this.cb('');
        },
        clickRemoveTags: function() {
            this.$el.find('.search-result-tags').hide();
            this.$el.find('.icon-search').val('');
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
            this.$el.find('.ajax-icon').remove();
            this.tags = this.$el.find('.icon-search').val();

            this.offset = 0;
            this.showAllIcons = false;
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
            var filteredIcons = this.$el.find('.filtered-icons');
            if (this.$el.find('.inview-icons').offset().top < filteredIcons.offset().top + (filteredIcons.height())) {
                return true;
            } else {
                return false;
            }
        },
        loadMore: function() {
            this.showLoader();

            var icons;

            if (this.tags == '' || this.showAllIcons) {
                this.showAllSearchResult();

                icons = this.getIcons('', this.offset);

                if (icons) {
                    this.offset = this.offset + this.limit;
                    this.$el.find('.search-result-all').append(icons);

                    if (this.checkLoadMore()) {
                        this.loadMore();
                    } else {
                        this.hideLoader();
                    }
                } else {
                    this.hideLoader();
                }
            } else {
                icons = this.getIcons(this.tags, this.offset);

                if (this.numberFoundByTagsIcons == 0) {
                    this.$el.find('.search-result-tags .search-result__shell-text').hide();
                    this.$el.find('.search-result-tags .no-search-result__text').show();
                } else {
                    this.$el.find('.search-result-tags .search-result__shell-text').show();
                    this.$el.find('.search-result-tags .no-search-result__text').hide();
                    this.$el.find('.search-result-tags .search-result__digit').html(this.numberFoundByTagsIcons);
                }

                if (icons) {
                    this.offset = this.offset + this.limit;
                    this.$el.find('.search-result-tags').append(icons);
                    if (this.checkLoadMore()) {
                        this.loadMore();
                    } else {
                        this.hideLoader();
                    }
                } else {
                    this.showAllIcons = true;
                    this.offset = 0;
                    this.loadMore();
                }
            }
        },
        getIcons: function(tags, offset) {
            var tagsArr = tags,
                result = [];

            if (_.isString(tagsArr)) {
                tagsArr = tagsArr.split(',');
            } else if (_.isArray(tagsArr)) {
                tagsArr = tagsArr.join('').split(',');
            }

            if ((tagsArr.length == 1 && tagsArr[tagsArr.length - 1] === '')) {
                var icons = this.icons.slice(offset, offset + this.limit);
                for (var i = 0; i < icons.length; i++) {
                    result.push('<div class="ajax-icon' + (this.icon != '' && icons[i].classes === this.icon.classes ? ' chosen ' : '') + '"><span data-icon-tags="' + icons[i].tags + '" class="' + icons[i].classes + '"></span> </div>');
                }
            } else {
                var dataSearchIcons = [];
                for (var y = 0; y < this.icons.length; y++) {
                    for (var j = 0; j < tagsArr.length; j++) {
                        var regEx = new RegExp(tagsArr[j].replace(/ /g, ' '));
                        if (tagsArr[j] !== '' && (this.icons[y].tags && this.icons[y].tags.match(regEx))) {
                            if (dataSearchIcons.indexOf(this.icons[y]) == -1) {
                                dataSearchIcons.push(this.icons[y]);
                            }
                        }
                    }
                }

                // Icons count by tags
                this.numberFoundByTagsIcons = dataSearchIcons.length;

                var searchIcons = dataSearchIcons.slice(offset, offset + this.limit);
                for (var x = 0; x < searchIcons.length; x++) {
                    result.push('<div class="ajax-icon' + (this.icon != '' && searchIcons[x].classes === this.icon.classes ? ' chosen ' : '') + '"><span  data-icon-tags="' + searchIcons[x].tags + '" class="' + searchIcons[x].classes + '"></span></div>');
                }
            }

            return result.join('');
        },
        showAllSearchResult: function() {
            if (!this.$el.find('.search-result-all').is(':visible')) {
                this.$el.find('.search-result-all').show();
                this.$el.find('.search-result-all .search-result__digit').html(this.icons.length);
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
         * Keyup event for filtering icons by tags in search input
         * @param {type} evt
         */
        searchFilter: function() {
            var self = this;

            var groupTags = [],
                data = this.icons;

            for (var i = 0; i < data.length; i++) {
                if (!_.isUndefined(data[i].tags)) {
                    groupTags.push(data[i].tags);
                }
            }

            var tagsList = _.union(_.flatten(groupTags));

            this.$el.find('.icon-search').autocomplete({
                source: tagsList,
                select: function(event, ui) {
                    self.tags = ui.item.value;
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
         * Return icon object from icon's storage with needed classes
         * @param {string} classes
         * @returns {Object} Iconobject
         */
        findByClasses: function(classes) {
            return _.findWhere(this.icons, { "classes": classes });
        },
        /**
         * Render IconCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(_.template(this.storage.getSkinTemplate('field-icon-setting-preview'))({
                "hideDeleteButton": this.settings.hideDeleteButton,
                'search': this.storage.__('search', 'Search'),
                'back': this.storage.__('back', 'Back'),
                'text_results': this.storage.__('results', 'Results'),
                'text_all_icons': this.storage.__('allIcons', 'All icons'),
                'no_search_result': this.storage.__('noResult', 'No results'),
                'icon': this.icon,
                'tags': this.tags
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
                this.$el.find('.icon-search').val(this.tags);
            }

            this.search();

            this.$el.find('.filtered-icons').on('scroll', function() {
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