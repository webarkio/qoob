/*global QoobMenuSettingsView, QoobMenuGroupsView, QoobMenuBlocksPreviewView, QoobMenuSavePageTemplateView, isMobile */
/**
 * Create view for menu in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuView.prototype */
    {
        id: "qoob-menu",
        menuViews: [],
        settingsViewStorage: [],
        groupActiveClass: 'group-list__link-active',
        /**
         * View menu
         * @class QoobMenuView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
        },
        addSettings: function(model) {
            var item = this.storage.getBlockConfig(model.get('lib'), model.get('block'));
            if (item) {
                this.addView(new QoobMenuSettingsView({
                    "model": model,
                    "config": item,
                    "storage": this.storage,
                    controller: this.controller
                }), 'left');
            }
        },
        /**
         * Render menu
         * @returns {Object}
         */
        render: function() {
            this.$el.html(_.template(this.storage.getSkinTemplate('qoob-menu-preview'))());
            var groups = this.storage.getGroups();

            this.addView(new QoobMenuGroupsView({
                storage: this.storage,
                groups: groups,
                controller: this.controller
            }));

            for (var i = 0; i < groups.length; i++) {
                this.addView(new QoobMenuBlocksPreviewView({
                    id: groups[i].id,
                    storage: this.storage,
                    controller: this.controller,
                    group: groups[i]
                }), 'right');
            }

            this.addView(new QoobMenuSavePageTemplateView({
                id: 'save-template',
                storage: this.storage,
                controller: this.controller
            }), 'left');

            this.draggable();

            return this;
        },
        draggable: function() {
            var self = this,
                longTouch = false,
                scrollbarWidth,
                parent;

            // set params for touch punch
            this.$el.find('.preview-block').data("blockPreventDefault", true);

            this.$el.find('.preview-block').draggable({
                appendTo: "body",
                helper: "clone",
                distance: 10,
                iframeFix: true,
                iframeScroll: true,
                scrollSensitivity: 100,
                scrollSpeed: 15,
                containment: 'document',
                opacity: 0.5,
                start: function() {
                    if (!longTouch) {
                        self.controller.removeEmptyDraggableElement();
                        return false;
                    } else {
                        if (isMobile.phone) {
                            self.controller.hideSwipeMenu();
                        }
                    }
                },
                stop: function() {
                    self.controller.removeEmptyDraggableElement();
                }
            });

            this.$el.find('.preview-block').each(function() {
                jQuery(this).on("mousedown", function() {
                    if (event.buttons === 0) {} else {
                        longTouch = true;
                    }
                });

                jQuery(this).on("touchstart", function(evt) {
                    var timer;
                    $this = jQuery(this);

                    scrollbarWidth = jQuery.position.scrollbarWidth();
                    parent = $this.parent('.preview-blocks');

                    timer = setTimeout(function() {
                        if (parent.get(0).scrollHeight > parent.get(0).clientHeight) {
                            parent.css('padding-right', scrollbarWidth).addClass('disable-scroll');
                        }
                        longTouch = true;

                        var simulateMousemove = jQuery.Event('mousemove');
                        var touch = evt.originalEvent.touches[0] || evt.originalEvent.changedTouches[0];

                        // coordinates
                        simulateMousemove.pageX = (touch.pageX + 10);
                        simulateMousemove.pageY = touch.pageY;
                        $this.trigger(simulateMousemove);

                    }, 500);

                    $this.one("touchend", function() {
                        longTouch = false;
                        if (parent.get(0).scrollHeight > parent.get(0).clientHeight) {
                            parent.removeAttr('style').removeClass('disable-scroll');
                        }
                        clearTimeout(timer);
                    });

                    $this.one("touchmove", function() {
                        clearTimeout(timer);
                    });
                });
            });
        },
        setEditMode: function() {
            this.$el.fadeIn(300);
        },
        showGroup: function(group) {
            this.hideSide('left');
            this.showSide('right', group);
        },
        showIndex: function() {
            this.hideSide('left');
            this.hideSide('right');
        },
        startEditBlock: function(id) {
            this.hideSide('right');
            this.showSide('left', id);
        },
        /**
         * Add view to side qoob
         * @param {Object} BackboneView  View from render
         * @param {String} side location
         */
        addView: function(view, side) {
            console.log('view');
            this.menuViews.push(view);
            if (side === 'left' || side === 'right') {
                this.$el.find('.qoob-menu-' + side + '-side').append(view.render().el);
            } else {
                this.$el.find('.qoob-menu-center').append(view.render().el);
            }
        },
        /**
         * Get SettingsView by id
         * @param {Number} id modelId
         */
        getSettingsView: function(id) {
            for (var i = 0; i < this.menuViews.length; i++) {
                if (this.menuViews[i].model && this.menuViews[i].model.id == id) {
                    return this.menuViews[i];
                }
            }
        },
        /**
         * Menu rotation
         * @param {Number} id
         * @param {String} side class
         */
        // rotate: function(id, side) {
        //     var self = this,
        //         findScreen = this.$el.find('[data-side-id="' + id + '"]'),
        //         currentSide = this.$el.find('[data-side-id="' + this.currentScreen + '"]');

        //     if (this.currentScreen === id) {
        //         currentSide.addClass('show');
        //         return;
        //     }

        //     this.$el.find('.' + screen).append(findScreen.clone());
        //     this.$el.find('.current-temporary').append(currentSide.clone());

        //     this.$el.find('.current-temporary').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
        //         if (e.target == this) {
        //             self.$el.find('#card').removeClass('rotate-forward rotate-backward');
        //             self.$el.find('[data-side-id]').removeClass('show');
        //             findScreen.addClass('show');
        //             self.$el.find('.' + screen).html('');
        //             self.$el.find('.current-temporary').html('');

        //             self.currentScreen = id;

        //             jQuery(this).off(e);
        //         }
        //     });
        // },
        /**
         * deprecated
         * Menu rotation forward
         * @param {Number} id
         */
        // rotateForward: function(id, cb) {
        //     this.rotate(id, 'forward-screen', 90, cb);
        // },
        /**
         * deprecated
         * Menu rotation backward
         * @param {Number} id
         */
        // rotateBackward: function(id, cb) {
        //     this.rotate(id, 'backward-screen', -90, cb);
        // },
        showSide: function(side, id) {
            var side = this.$el.find('.qoob-menu-' + side + '-side');

            // Selected item menu
            this.$el.find('[data-group-id]').removeClass(this.groupActiveClass);
            if (this.$el.find('[data-group-id=' + id + ']').length) {
                this.$el.find('[data-group-id=' + id + ']').addClass(this.groupActiveClass);
            }

            if (!side.hasClass('show-side')) {
                side.addClass('show-side');
            }

            side.find('[data-side-id]').removeClass('side-item-show');
            side.find('[data-side-id="' + id + '"]').addClass('side-item-show');
        },
        hideSide: function(side) {
            var side = this.$el.find('.qoob-menu-' + side + '-side');

            if (side.find('[data-side-id]').hasClass('side-item-show')) {
                this.$el.find('[data-group-id]').removeClass(this.groupActiveClass);
            }

            if (side.hasClass('show-side')) {
                side.removeClass('show-side');
            }
        },
        onEditStart: function(blockId) {
            this.rotate('settings-block-' + blockId);
        },
        onEditStop: function() {
            this.rotate('catalog-groups');
        },
        onEditMode: function() {
            this.$el.fadeIn(300);
        },
        /**
         * Delete view from settingsViewStorage
         * @param {String} view name
         */
        delView: function(name) {
            if (this.settingsViewStorage && this.settingsViewStorage[name]) {
                this.settingsViewStorage[name].dispose();
                delete this.settingsViewStorage[name];
            }
        },
        deleteSettings: function(model) {
            this.controller.stopEditBlock();

            var settings = this.getSettingsView(model.id);
            settings.dispose();
        },
        /**
         * Hide groups and blocks in menu those are not contained in selected lib.
         * @param  {String} libName Lib name for which not to hide groups and blocks
         */
        hideLibsExcept: function(libName) {
            var self = this,
                groups = this.$el.find('ul.catalog-list li'),
                blocks = this.$el.find('.preview-block');

            groups.hide();
            blocks.hide();

            if (libName !== 'all') {
                groups = groups.filter(function(index) {
                    return self.$(groups[index]).hasClass(libName);
                });
                blocks = blocks.filter(function(index) {
                    return self.$(blocks[index]).hasClass(libName);
                });
            }

            groups.show();
            blocks.show();
        },
        hideNotice: function() {
            var viewSaveTemplate = _.findWhere(this.menuViews, { 'id': 'save-template' }),
                element = viewSaveTemplate.$el;

            if (element.find('.save-template-settings').hasClass('show-notice')) {
                element.find('.remove').trigger('click');
                element.find('.input-text').val('');
                element.find('.save-template-settings').removeClass('show-notice');
            }
            if (element.find('.error-block').is(':visible')) {
                element.find('.error-block').hide();
            }
            if (element.find('.input-text').hasClass('error')) {
                element.find('.input-text').removeClass('error');
            }
        },
        /**
         * Show sidebar menu
         */
        showSwipeMenu: function() {
            jQuery('#qoob').removeClass('close-panel');
        },
        /**
         * Hide sidebar menu
         */
        hideSwipeMenu: function() {
            if (!jQuery('#qoob').hasClass('close-panel')) {
                jQuery('#qoob').addClass('close-panel');
            }
        }
    });