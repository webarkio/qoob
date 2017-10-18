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
            ).find('.settings-blocks').html(html);

            return this;
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