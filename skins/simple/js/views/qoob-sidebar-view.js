/**
 * Create view for sidebar in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */

var QoobSidebarView = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    /** @lends QoobSidebarView.prototype */
    attributes: function() {
        return {
            id: "qoob-sidebar"
        };
    },
    /**
     * View sidebar
     * @class QoobSidebarView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
    },
    /**
     * Render sidebar
     * @returns {Object}
     */
    render: function() {
        this.afterRender();
        return this;
    },
    afterRender: function() {
        var self = this,
            counter = 0,
            fields;

        var getAllow = function(fields) {
            var allow,
                allowedFields = ['image', 'video'];

            if (fields != undefined) {
                for (var i = 0; i < fields.length; i++) {
                    if (allowedFields.indexOf(fields[i].settings.type) > -1) {
                        allow = true;
                        break;
                    } else if (fields[i].settings.type == 'accordion' || fields[i].settings.type == 'accordion_flip') {
                        var searchField = _.some(fields[i].settings.settings, function(item) {
                            if (allowedFields.indexOf(item.type) > -1) {
                                return item;
                            }
                        });

                        if (searchField) {
                            allow = true;
                            break;
                        }
                    } else {
                        allow = false;
                    }
                }
            }

            return allow;
        }

        var getCurrentRoute = function(evt) {
            var currentRoute = self.controller.current();
            if (['startEditBlock', 'default'].indexOf(currentRoute.route) == -1) {
                evt.stopImmediatePropagation();
            }
        }

        this.$el.on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
                getCurrentRoute(evt);
            })
            .on('dragenter', function(evt) {
                getCurrentRoute(evt);

                counter++;
                if (counter === 1) {
                    fields = self.controller.layout.menu.currentView.fields;
                    if (getAllow(fields)) {
                        for (var i = 0; i < fields.length; i++) {
                            fields[i].$el.trigger('global_drag_start');
                        }
                        self.controller.layout.sidebar.$el.addClass('overlay');
                    }
                }
            })
            .on('dragleave', function(evt) {
                getCurrentRoute(evt);

                counter--;
                if (counter === 0) {
                    self.controller.layout.sidebar.$el.removeClass('overlay');
                }
            })
            .on('dragover', function(evt) {
                evt.preventDefault();
            })
            .on('drop', function(evt) {
                evt.preventDefault();
                getCurrentRoute(evt);
                self.controller.layout.sidebar.$el.removeClass('overlay');
                counter = 0;
            });
    },
    setPreviewMode: function() {
        this.$el.addClass('hide-sidebar');
    },
    setEditMode: function() {
        var self = this;
        this.controller.layout.editModeButton.$el.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e) {
            if (e.target == this) {
                self.$el.removeClass('hide-sidebar');
                self.controller.layout.resize();
                self.controller.layout.editModeButton.$el.off('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd');
            }
        });
    },
    /**
     * Show sidebar menu
     */
    showSwipeMenu: function() {
        this.controller.layout.$el.removeClass('close-panel');
    },
    /**
     * Hide sidebar menu
     */
    hideSwipeMenu: function() {
        if (!this.controller.layout.$el.hasClass('close-panel')) {
            this.controller.layout.$el.addClass('close-panel');
        }
    }
});