/*global QoobFieldsView*/
/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuSettingsView = QoobFieldsView.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuSettingsView.prototype */
    {
        tagName: "div",
        className: "settings",
        config: null,
        events: {
            'click .delete-block': 'clickDelete',
            'click .movedown': 'clickMoveDown',
            'click .moveup': 'clickMoveUp'
        },
        /**
         * Set setting's id
         * @class SettingsView
         * @augments Backbone.View
         * @constructs
         */
        attributes: function() {
            return {
                'data-side-id': this.model.id,
                id: "settings-block-" + this.model.id
            };
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            var html = QoobFieldsView.prototype.getHtml.apply(this, arguments);

            this.$el.html(
                _.template(
                    this.storage.getSkinTemplate('menu-settings-preview')
                )({ config: this.config, 'back': this.storage.__('back', 'Back'), 'move': this.storage.__('move', 'Move') })
            ).find('.settings-blocks').html(html); // prepend(this.fieldsView.render().el);

            this.afterRender();

            return this;
        },
        afterRender: function() {
            var self = this,
                counter = 0,
                fields = this.fields,
                allow = false;

            // allow fields
            var allowedArr = ['image', 'video'];

            for (var i = 0; i < fields.length; i++) {
                if (~allowedArr.indexOf(fields[i].settings.type)) {
                    allow = true;
                }
            }

            var getCurrentRoute = function(evt) {
                var currentRoute = self.controller.current();
                if (currentRoute.route !== 'startEditBlock') {
                    evt.stopImmediatePropagation();
                }
            }

            if (allow) {
                self.controller.layout.sidebar.$el.on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
                        evt.preventDefault();
                        evt.stopPropagation();

                        getCurrentRoute(evt);
                    })
                    .on('dragenter', function(evt) {
                        getCurrentRoute(evt);

                        counter++;
                        if (counter === 1) {
                            for (var i = 0; i < fields.length; i++) {
                                fields[i].$el.trigger('global_drag_start');
                            }
                            self.controller.layout.sidebar.$el.addClass('overlay');
                        }
                    })
                    .on('dragleave', function(evt) {
                        getCurrentRoute(evt);

                        counter--;
                        if (counter === 0) {
                            self.controller.layout.sidebar.$el.removeClass('overlay');
                        }
                    })
                    .on('drop', function(evt) {
                        getCurrentRoute(evt);

                        self.controller.layout.sidebar.$el.removeClass('overlay');
                        counter = 0;
                    });
            }
        },
        /**
         * Click button remove block
         * @returns {Boolean}
         */
        clickDelete: function() {
            var alert = confirm(this.storage.__('confirm_delete_block', 'Are you sure you want to delete the block?'));
            if (!alert) {
                return false;
            }

            this.controller.deleteBlock(this.model);
        },
        /**
         * Click move block down
         */
        clickMoveDown: function() {
            this.controller.moveDownBlock(this.model);
        },
        /**
         * Click move block up
         */
        clickMoveUp: function() {
            this.controller.moveUpBlock(this.model);
        },
        dispose: function() {
            // same as this.$el.remove();
            this.$el.remove();

            // unbind events that are
            // set on this view
            this.off();

            // remove all models bindings
            // made by this view
            this.model.off(null, null, this);
        }
    });