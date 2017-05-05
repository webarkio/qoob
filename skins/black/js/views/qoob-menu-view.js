/*global QoobMenuSettingsView, QoobMenuGroupsView, QoobMenuBlocksPreviewView, QoobMenuSavePageTemplateView */
/**
 * Create view for menu in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuView.prototype */
    {
        id: "qoob-menu",
        currentScreen: 'catalog-groups',
        menuViews: [],
        settingsViewStorage: [],
        events: {
            'change #lib-select': 'changeLib'
        },
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
                }));
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
                    id: 'group-' + groups[i].id,
                    storage: this.storage,
                    controller: this.controller,
                    group: groups[i]
                }));
            }

            this.addView(new QoobMenuSavePageTemplateView({
                id: 'save-template',
                storage: this.storage,
                controller: this.controller
            }));

            this.draggable();

            this.$el.find('#lib-select').selectpicker();

            return this;
        },

        draggable: function() {
            var self = this;
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
                    self.controller.layout.viewPort.getIframeContents().find(".qoob-drag-hide").hide();
                },
                stop: function() {
                    self.controller.layout.viewPort.getIframeContents().find(".qoob-drag-hide").show();
                }
            });
        },

        setPreviewMode: function() {
            this.$el.fadeOut(300);
        },
        setEditMode: function() {
            this.$el.fadeIn(300);
        },
        showGroup: function(group) {
            this.rotateForward('group-' + group);
        },
        showIndex: function() {
            this.rotateBackward('catalog-groups');
        },
        startEditBlock: function(blockId) {
            this.rotateForward(blockId);
        },
        /**
         * Resize menu
         */
        resize: function() {
            this.$el.css({
                height: jQuery(window).height() - 70,
                top: 70
            });
        },
        /**
         * Add view to side qoob
         * @param {Object} BackboneView  View from render
         */
        addView: function(view) {
            this.menuViews.push(view);
            this.$el.find('.current-screen').append(view.render().el);
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
         * @param {String} screen Class side
         * @param {Number} deg number transform
         */
        rotate: function(id, screen, deg, cb) {
            var self = this;

            this.$el.find('#card').addClass('rotate');

            var findScreen = this.$el.find('[data-side-id="' + id + '"]'),
                cloneElement = this.$el.find('[data-side-id="' + id + '"]').clone(),
                elemRotate = this.$el.find('.card-main'),
                isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

            this.currentScreen = id;

            this.$el.find('.card-main').prepend(jQuery('<div>', {
                class: screen + ' side'
            }).append(cloneElement.show()));

            var rotateMethod = function() {
                self.$el.find('[data-side-id]').hide(0, function() {
                    findScreen.show(0, function() {
                        elemRotate.removeAttr("style");
                        self.$el.find('#card').removeClass('rotate');
                        self.$el.find('.' + screen).remove();
                    });
                });
                if (cb) {
                    cb();
                }
            };

            if (!isIE11) {
                jQuery({
                    deg: 0
                }).animate({
                    deg: deg
                }, {
                    easing: '',
                    duration: 250,
                    step: function(now) {
                        elemRotate.css({
                            transform: 'rotateY(' + now + 'deg)'
                        });
                    },
                    complete: function() {
                        rotateMethod();
                    }
                });
            } else {
                rotateMethod();
            }
        },
        /**
         * Menu rotation forward
         * @param {Number} id
         */
        rotateForward: function(id, cb) {
            this.rotate(id, 'forward-screen', 90, cb);
        },
        /**
         * Menu rotation backward
         * @param {Number} id
         */
        rotateBackward: function(id, cb) {
            this.rotate(id, 'backward-screen', -90, cb);
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
        changeLib: function(evt) {
            var target = jQuery(evt.target);
            this.controller.changeLib(target.val());
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
        }
    });
