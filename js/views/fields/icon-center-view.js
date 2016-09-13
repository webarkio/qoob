/**
 * Create IconCenterView view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var IconCenterView = Backbone.View.extend(
        /** @lends IconCenterView.prototype */{
            className: "settings menu-block",
            parentId: null,
            events: {
                'click .backward-icon': 'backward',
                'click #inner-settings-icon .ajax-icon': 'selectIcon',
                'click #inner-settings-icon .ajax-icon.chosen': 'unselectIcon',
                'keyup #inner-settings-icon .icon-search': 'searchFilter',
                'change #inner-settings-icon .icon-pack': 'categoryChange',
                'click .delete-icon': 'deleteIcon'
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
             * View IconCenter
             * @class IconCenterView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (options) {
                this.storage = options.storage;
                this.controller = options.controller;
                this.tpl = _.template(this.storage.qoobTemplates['field-icon-setting-preview']);
                this.parentId = options.parentId;
                this.backId = (options.parentId === undefined) ? "settings-block-" + this.model.id : "settings-block-" + options.parentId;
                this.icons = options.icons;
                this.icon = options.icon;
            },
            /**
             * Render IconCenter view
             * @returns {Object}
             */
            render: function () {
                //Creating layout
                this.$el.html(this.tpl({
                    icons: this.icons,
                    'back': qoob_lng.menu.back,
                    'all': qoob_lng.fields.all,
                    'tags': qoob_lng.fields.tags
                }));

                this.afterRender();

                return this;
            },
            /**
             * Actions to do after element is rendered 
             *
             */
            afterRender: function () {
                var packs = [];

                for (var i in this.icons) {
                    var pack = this.icons[i].classes.split(' ')[0] || 'all';
                    if (!_.contains(packs, pack)) {
                        packs.push(pack);
                        this.$el.find('.icon-pack').append('<option value="' + pack + '">' + pack + '</option>');
                    }
                }
                //Inserting tags if such existed
                if (!!this.icon.tags) {
                    this.$el.find('.icon-search').val(this.icon.tags);
                    this.$el.find('.icon-search').trigger('keyup');
                }
                //Initialize select picker
                this.$('.icon-pack').selectpicker();
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
             * Setting an icon by clicking it
             * @param {type} evt
             * @returns {undefined}
             */
            selectIcon: function (evt) {
                this.$el.find('.ajax-icon').removeClass('chosen');
                evt.currentTarget.classList.add('chosen');
                window.selectFieldIcon(this.$(evt.currentTarget).find('span').attr('class'), this.$(evt.currentTarget).find('span').attr('data-icon-tags'));
            },
            /**
             * Unset the chosen icon and returning to the default one
             */
            unselectIcon: function (evt) {
                this.$el.find('.ajax-icon').removeClass('chosen');
                evt.currentTarget.classList.remove('chosen');
                window.selectFieldIcon(this.icon.classes, this.icon.tags);
            },
            /**
             * Delete icon
             * @param {type} evt
             */
            deleteIcon: function (evt) {
                window.selectFieldIcon('empty');
                this.controller.layout.menu.rotate(this.backId);
            },
            /**
             * Keyup event for filtering icons by tags in search input
             * @param {type} evt
             */
            searchFilter: function (evt) {
                var self = this,
                        filteredWords = evt.target.value.split(','),
                        iconsToFilter = this.$el.find('.ajax-icon');

                iconsToFilter.css('display', 'inline-block');

                if (filteredWords.length <= 1 && filteredWords[0] === '') {
                    iconsToFilter.css('display', 'inline-block');
                } else {
                    iconsToFilter.each(function () {
                        var filtered = false;
                        for (var i = 0; i < filteredWords.length; i++) {
                            var regEx = new RegExp(filteredWords[i].replace(/ /g, ' *'));
                            if (filteredWords[i] !== '' && self.$(this).find('span').attr('data-icon-tags').match(regEx)) {
                                filtered = true;
                                self.$(this).css('display', 'inline-block');
                                break;
                            }
                        }
                        if (!filtered) {
                            self.$(this).hide();
                            //Question: first time fadeOut() doesn't work, but hide() dose
                        }
                    });
                }
            },
            /**
             * Filtering icons by category select controller
             * @param {type} evt
             * @returns {undefined}
             */
            categoryChange: function (evt) {
                var pack = evt.target.value,
                        iconsToFilter = this.$el.find('.ajax-icon');

                iconsToFilter.removeClass('not-in-pack');

                if (pack !== 'all') {
                    iconsToFilter.each(function () {
                        if (pack !== this.getAttribute('data-icon-pack')) {
                            this.classList.add('not-in-pack');
                        }
                    });
                }

                this.$el.find('.icon-search').trigger('keyup');
            }
        });