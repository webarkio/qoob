/*global window*/
/**
 * Create IconCenterView view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var IconCenterView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends IconCenterView.prototype */
    {
        className: "settings menu-block",
        offset: 0,
        limit: 12,
        dataSearchIcons: null,
        events: {
            'keydown': 'keyAction',
            'click .backward-icon': 'backward',
            'click #inner-settings-icon .ajax-icon': 'selectIcon',
            'keyup #inner-settings-icon .icon-search': 'searchFilter',
            'click .remove': 'clickRemoveIcon',
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
         * View IconCenter
         * @class IconCenterView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.controller = options.controller;
            this.tpl = _.template(this.storage.getSkinTemplate('field-icon-setting-preview'));
            this.backId = (options.parentId === undefined) ? this.model.id : options.parentId;
            this.icons = options.icons;
            this.icon = options.icon;
            this.tags = options.icon.tags || '';
        },
        /**
         * Render IconCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(this.tpl({
                back: this.storage.__('back', 'Back'),
                search: this.storage.__('search', 'Search'),
                'no_icon': this.storage.__('no_icon', 'No icon'),
                icon: this.icon
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

            this.loadMore();
            this.$el.find('.filtered-icons').on('scroll', function() {
                if (self.checkLoadMore()) {
                    self.loadMore();
                }
            });
        },
        checkLoadMore: function() {
            var filteredIcons = this.$el.find('.filtered-icons');
            if (this.$el.find('.inview-icons').offset().top < filteredIcons.offset().top + (filteredIcons.height())) {
                return true;
            } else {
                return false;
            }
        },
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.$el.find(".search-button").click();
                this.$el.find('.icon-search').autocomplete('close');
                return false;
            }
        },
        clickSearchButton: function() {
            var filteredWords = this.$el.find('.icon-search').val().split(','),
                filteredIcons = this.$el.find('.filtered-icons');

            filteredIcons.find('.ajax-icon').remove();

            this.tags = filteredWords;
            this.offset = 0;
            this.loadMore();
        },
        loadMore: function() {
            var filteredIcons = this.$el.find('.filtered-icons'),
                icons = this.getIcons(this.tags, this.offset);

            if (icons) {
                this.offset = this.offset + this.limit;
                filteredIcons.find('.inview-icons').before(icons);
                if (this.checkLoadMore()) {
                    this.loadMore();
                }
            }
        },
        getIcons: function(tags, offset) {
            var filteredWords = tags,
                result = [];

            if (_.isString(filteredWords)) {
                filteredWords = filteredWords.split(',');
            } else if (_.isArray(filteredWords)) {
                filteredWords = filteredWords.join('').split(',');
            }

            if ((filteredWords.length <= 1 && filteredWords[0] === '') || !filteredWords) {
                var icons = this.icons.slice(offset, offset + this.limit);
                for (var i = 0; i < icons.length; i++) {
                    result.push('<div class="ajax-icon"><span  data-icon-tags="' + icons[i].tags + '" class="' + icons[i].classes + '"></span> </div>');
                }
            } else {
                this.dataSearchIcons = [];
                for (var y = 0; y < this.icons.length; y++) {
                    for (var j = 0; j < filteredWords.length; j++) {
                        var regEx = new RegExp(filteredWords[j].replace(/ /g, ' *'));
                        if (filteredWords[j] !== '' && this.icons[y].tags.match(regEx)) {
                            this.dataSearchIcons.push(this.icons[y]);
                        }
                    }
                }

                var searchIcons = this.dataSearchIcons.slice(offset, offset + this.limit);
                for (var x = 0; x < searchIcons.length; x++) {
                    result.push('<div class="ajax-icon"><span  data-icon-tags="' + searchIcons[x].tags + '" class="' + searchIcons[x].classes + '"></span> </div>');
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
         * Setting an icon by clicking it
         * @param {type} evt
         * @returns {undefined}
         */
        selectIcon: function(evt) {
            if (evt.currentTarget.classList.contains('chosen')) {
                return;
            }
            var currentTarget = this.$(evt.currentTarget).find('span');
            this.$el.find('.ajax-icon').removeClass('chosen');
            evt.currentTarget.classList.add('chosen');
            if (this.$el.find('.selected-icon').hasClass('empty')) {
                this.$el.find('.selected-icon').removeClass('empty');
            }
            this.$el.find('.preview-icon span').attr({
                'class': currentTarget.attr('class'),
                'data-icon-tags': currentTarget.attr('data-icon-tags')
            });
            window.selectFieldIcon(currentTarget.attr('class'));
        },
        /**
         * Delete icon
         * @param {type} evt
         */
        clickRemoveIcon: function(evt) {
            evt.preventDefault();
            window.selectFieldIcon('');
            this.$el.find('.selected-icon').addClass('empty');
            this.$el.find('.ajax-icon').removeClass('chosen');
        },
        /**
         * Keyup event for filtering icons by tags in search input
         * @param {type} evt
         */
        searchFilter: function() {
            var self = this;

            var groupTags = [], data = this.icons;

            for (var i = 0; i < data.length; i++) {
                if (! _.isUndefined(data[i].tags) ) {
                    groupTags.push(data[i].tags);
                }
            }

            var tagsList = _.union(_.flatten(groupTags));

            this.$el.find('.icon-search').autocomplete({
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
        }
    });
