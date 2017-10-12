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
        events: {
            'keydown': 'keyAction',
            'click .ajax-icon': 'selectIcon',
            'keyup .icon-search': 'searchFilter',
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
            this.tpl = _.template(this.storage.getSkinTemplate('field-icon-setting-preview'));
            this.icons = options.icons;
            this.icon = options.icon;
            this.tags = options.icon.tags || '';
            this.cb = options.cb;
            this.parent = options.parent;
            this.model = options.model;

            this.listenTo(this.model, 'change', function(select) {
                var icon = Object.keys(select.changed)[0];
                this.changeIcon(select.changed[icon]);
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
                this.search();
                this.$el.find('.icon-search').autocomplete("search", "");
                return false;
            }
        },
        search: function() {
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
                    result.push('<div class="ajax-icon' + (this.icon != '' && icons[x].classes === this.icon.classes ? ' chosen ' : '') + '"><span data-icon-tags="' + icons[i].tags + '" class="' + icons[i].classes + '"></span> </div>');
                }
            } else {
                var dataSearchIcons = [];
                for (var y = 0; y < this.icons.length; y++) {
                    for (var j = 0; j < filteredWords.length; j++) {
                        var regEx = new RegExp(filteredWords[j].replace(/ /g, ' '));
                        if (filteredWords[j] !== '' && (this.icons[y].tags && this.icons[y].tags.match(regEx))) {
                            if (dataSearchIcons.indexOf(this.icons[y]) < 0) {
                                dataSearchIcons.push(this.icons[y]);
                            }
                        }
                    }
                }

                var searchIcons = dataSearchIcons.slice(offset, offset + this.limit);
                for (var x = 0; x < searchIcons.length; x++) {
                    result.push('<div class="ajax-icon' + (this.icon != '' && searchIcons[x].classes === this.icon.classes ? ' chosen ' : '') + '"><span  data-icon-tags="' + searchIcons[x].tags + '" class="' + searchIcons[x].classes + '"></span></div>');
                }
            }

            return result.join('');
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

            this.changeIcon(currentTarget.attr('class'));
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

                this.$el.find('.ajax-icon').removeClass('chosen');

                this.$el.find('.icon-search').val('');
            } else {
                var iconObject = this.findByClasses(icon);

                this.$el.find('.field-icon-container-inner').removeClass('empty');

                this.$el.find('.field-icon__selected-icon span').attr({
                    'class': icon,
                    'data-icon-tags': (iconObject ? iconObject.tags : '')
                });

                this.icon = { class: icon, tags: (iconObject ? iconObject.tags : '') };

                this.cb(icon);
            }
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
         * Return icon object from icon's storage with needed classes
         * @param {string} classes
         * @returns {Object} Iconobject
         */
        findByClasses: function(classes) {
            return _.findWhere(this.icons, { "classes": classes });
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
         * Render IconCenter view
         * @returns {Object}
         */
        render: function() {
            //Creating layout
            this.$el.html(this.tpl({
                search: this.storage.__('search', 'Search'),
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
        }
    });