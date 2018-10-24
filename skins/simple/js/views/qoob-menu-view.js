/*global QoobMenuSettingsView, QoobMenuGroupsView, QoobMenuBlocksPreviewView, QoobMenuSavePageTemplateView, device */
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
            this.currentSide = null;
            this.currentView = null;
        },
        addSettings: function(model) {
            var item = this.storage.getBlockConfig(model.get('lib'), model.get('block'));
            if (item) {
                this.addView(new QoobMenuSettingsView({
                    "id": 'edit' + '-' + model.id,
                    "name": 'edit' + '-' + model.id,
                    "model": model,
                    "settings": item.settings,
                    "defaults": item.defaults,
                    "storage": this.storage,
                    "controller": this.controller
                }), 'main');
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
                id: 'catalog-groups',
                storage: this.storage,
                groups: groups,
                controller: this.controller
            }), 'main');

            for (var i = 0; i < groups.length; i++) {
                this.addView(new QoobMenuBlocksPreviewView({
                    id: groups[i].id,
                    storage: this.storage,
                    controller: this.controller,
                    group: groups[i],
                }), 'right');
            }

            this.addView(new QoobMenuSavePageTemplateView({
                name: 'save-template',
                storage: this.storage,
                controller: this.controller
            }), 'main');

            this.draggable();

            return this;
        },
        draggable: function() {
            var self = this,
                longTouch = false;

            // set params for touch punch
            this.$el.find('.preview-block').data("blockPreventDefault", true);

            var deviceLocal = this.controller.layout.getDeviceState();

            // @property edge: Boolean; `true` for the Edge web browser.
            var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

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
                        if (deviceLocal === 'mobile' || deviceLocal === 'tablet') {
                            self.controller.layout.hideSwipeMenu();
                        }
                    }

                    if (device.ios() !== true && (window.PointerEvent && edge !== true)) {
                        self.controller.navigate('', {
                            trigger: true
                        });
                    }                    
                },
                stop: function() {
                    self.controller.removeEmptyDraggableElement();
                }
            });

            this.$el.find('.preview-block').each(function() {
                jQuery(this)[0].addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);


                jQuery(this).on("mousedown", function(event) {
                    if (event.buttons === 0 || device.ios()) { } else {
                        longTouch = true;
                    }
                });

                jQuery(this).on("touchstart", function(evt) {
                    var timer,
                        $this = jQuery(this);

                    parent = $this.parent('.preview-blocks');

                    timer = setTimeout(function() {
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
                        clearTimeout(timer);
                    });

                    $this.one("touchmove", function(event) {
                        event.preventDefault();
                        clearTimeout(timer);
                    });
                });
            });
        },
        showGroup: function(group) {
            this.showSide('right', group);
        },
        showIndex: function(isBack) {
            this.hideSide('right');
            var newSide = this.getView("catalog-groups");

            if (this.currentSide && this.currentSide.side) {
                this.changeSide(this.currentSide.side, newSide.side, isBack);
            } else {
                this.changeSide(null, newSide.side, isBack);
            }
            this.currentView = newSide;
            this.currentSide = newSide.side;
        },
        startEditBlock: function(id, isBack) {
            this.hideSide('right');
            var newSide = this.getSettingsView(id);

            if (this.currentSide && this.currentSide.side) {
                this.changeSide(this.currentSide.side, newSide.side, isBack);
            } else {
                this.changeSide(null, newSide.side, isBack);
            }
            this.currentView = newSide;
            this.currentSide = newSide.side;

            // hook for field accordion
            var accordion = newSide.$el.find('.accordion');
            if (accordion.length > 0) {
                accordion.accordion("option", "active", false);
            }
        },
        showSavePageTemplate: function(isBack) {
            this.hideSide('right');
            var newSide = this.getView("save-template");

            if (this.currentSide && this.currentSide.side) {
                this.changeSide(this.currentSide, newSide, isBack);
            } else {
                this.changeSide(null, newSide.side, isBack);
            }

            this.currentView = newSide;
            this.currentSide = newSide.side;
        },
        /**
         * Add view to position qoob
         * @param {Object} BackboneView  View from render
         * @param {String} side location
         */
        addView: function(view, position) {
            this.menuViews.push(view);
            this.$el.find('.qoob-menu-' + position + '-side').append(view.render().el);
        },
        setInnerSettingsView: function(view) {
            this.addView(view, 'main');
        },
        showInnerSettingsView: function(id, isBack) {
            var newView = this.getView(id);
            this.changeSide(this.currentSide, newView.side, isBack);
            this.currentView = newView;
            this.currentSide = newView.side;
        },
        /**
         * Get SettingsView by name
         * @param {String}  name view
         */
        getView: function(name) {
            for (var i = 0; i < this.menuViews.length; i++) {
                if (this.menuViews[i].name == name) {
                    return this.menuViews[i];
                }
            }
        },
        getSettingsView: function(id) {
            for (var i = 0; i < this.menuViews.length; i++) {
                if (this.menuViews[i].model && this.menuViews[i].model.id == id) {
                    return this.menuViews[i];
                }
            }
        },
        showSide: function(position, id) {
            var side = this.$el.find('.qoob-menu-' + position + '-side');

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
        hideSide: function(position) {
            var side = this.$el.find('.qoob-menu-' + position + '-side');

            if (side.hasClass('show-side')) {
                side.removeClass('show-side');
            }

            side.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
                if (e.target == this) {
                    if (!side.hasClass('show-side')) {
                        if (side.find('[data-side-id]').hasClass('side-item-show')) {
                            side.find('[data-side-id]').removeClass('side-item-show')
                        }
                    }

                    jQuery(this).off(e);
                }
            });

            this.$el.find('[data-group-id]').removeClass(this.groupActiveClass);
        },
        changeSide: function(oldSide, newSide, direction) {
            var self = this,
                cloneSide;

            if (oldSide == newSide)
                return false;

            if (direction) { // back
                cloneSide = oldSide.$el.clone();

                this.$el.find('.qoob-menu-backward-side').append(cloneSide.addClass('side-item-show'));

                if (oldSide) {
                    oldSide.$el.removeClass('side-item-show');
                }

                this.$el.addClass('show-backward');

                newSide.$el.addClass('side-item-show');

                this.$el.find('.qoob-menu-backward-side').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
                    if (e.target == this) {
                        self.$el.find('.qoob-menu-backward-side').html('');
                        self.$el.removeClass('show-backward');
                        jQuery(this).off(e);
                    }
                });
            } else { // forward
                if (newSide !== undefined) {
                    cloneSide = newSide.$el.clone();

                    this.$el.find('.qoob-menu-forward-side').append(cloneSide.addClass('side-item-show'));

                    this.$el.addClass('show-forward');

                    this.$el.find('.qoob-menu-forward-side').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
                        if (e.target == this) {
                            if (oldSide) {
                                oldSide.$el.removeClass('side-item-show');
                            }
                            newSide.$el.addClass('side-item-show');
                            self.$el.find('.qoob-menu-forward-side').html('');
                            self.$el.removeClass('show-forward');
                            
                            // Start afterRender method for mediacenter
                            newSide.$el.trigger('shown');
                            
                            jQuery(this).off(e);
                        }
                    });                    
                }
            }
        },
        onEditMode: function() {
            this.$el.fadeIn(300);
        },
        deleteSettings: function(model) {
            this.controller.stopEditBlock();

            var settings = this.getSettingsView(model.id);
            if (undefined !== settings) {
                settings.dispose();
            }
        },
        hideNotice: function() {
            var viewSaveTemplate = _.findWhere(this.menuViews, { 'id': 'save-template' }),
                element = viewSaveTemplate.$el;

            if (element.find('.save-template-settings').hasClass('show-notice')) {
                element.find('.remove').trigger('click');
                element.find('.input-text').val('');
                element.find('.save-template-settings').removeClass('show-notice');
                element.find('.field-text').show();
            }

            element.find('.save-template-settings .button-save-template').show();

            element.find('.error-block').hide();

            if (element.find('.field-text').hasClass('error')) {
                element.find('.field-text').removeClass('error');
            }
        },
        hideSwipeMenu: function() {
            var currentRoute = this.controller.current();
            
            if (currentRoute.route.indexOf('index') != 0) {
                this.controller.isBack = true;
                this.controller.navigate('', {
                        trigger: true,
                        replace: true
                });
            }
        },
        setPreviewMode: function() {
            var deviceLocal = this.controller.layout.getDeviceState();
            if (deviceLocal == 'desktop' && 
                (this.currentView != null && this.currentView.name == 'catalog-groups')) {
                this.hideSide('right');

                this.controller.navigate('', {
                        trigger: true,
                        replace: true
                });
            }
        }
    });