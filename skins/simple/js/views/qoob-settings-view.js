/*global QoobFieldsView*/
/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuSettingsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuSettingsView.prototype */
    {
        tagName: "div",
        className: "settings menu-block",
        config: null,
        events: {
            'click .back': 'clickBack',
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
                id: "settings-block-" + this.model.id,
                'data-side-id': this.model.id
            };
        },
        /**
         * View settings
         * @class QoobMenuSettingsView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.model = options.model;
            this.config = options.config;
            this.storage = options.storage;
            this.controller = options.controller;
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            this.settingsBlock = new QoobFieldsView({
                model: this.model,
                storage: this.storage,
                settings: this.config.settings,
                defaults: this.config.defaults,
                controller: this.controller,
                className: 'settings-block'
            });

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-settings-preview'))({ config: this.config, 'back': this.storage.__('back', 'Back'), 'move': this.storage.__('move', 'Move') })).find('.settings-blocks').prepend(this.settingsBlock.render().el);

            this.afterRender();

            return this;
        },
        afterRender: function() {
            var self = this,
                counter = 0,
                fields = this.settingsBlock.fields;

            this.$el.on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
                    evt.preventDefault();
                    evt.stopPropagation();
                })
                .on('dragenter', function() {
                    counter++;
                    if (counter === 1) {
                        for (var i = 0; i < fields.length; i++) {
                            fields[i].$el.trigger('global_drag_start');
                        }
                        self.$el.addClass('overlay');
                    }
                })
                .on('dragleave', function() {
                    counter--;
                    if (counter === 0) {
                        for (var i = 0; i < fields.length; i++) {
                            fields[i].$el.trigger('global_drag_stop');
                        }
                        self.$el.removeClass('overlay');
                    }
                })
                .on('drop', function() {
                    for (var i = 0; i < fields.length; i++) {
                        fields[i].$el.trigger('global_drag_stop');
                    }
                    self.$el.removeClass('overlay');
                    counter = 0;
                });
        },
        clickBack: function(e) {
            e.preventDefault();
            this.controller.stopEditBlock();
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
