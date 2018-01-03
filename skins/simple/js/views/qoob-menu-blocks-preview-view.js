/*global device*/
/**
 * Create view block's preview
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuBlocksPreviewView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuBlocksPreviewView.prototype */
    {
        className: 'preview-block-wrap',
        events: {
            'click .preview-block': 'clickPreviewBlock',
            'click .backward-button': 'clickBackward'
        },
        attributes: function() {
            return {
                'data-side-id': this.id
            };
        },
        clickBackward: function() {
            this.controller.backward();
        },
        clickPreviewBlock: function(evt) {
            var name = evt.currentTarget.id.replace('preview-block-', ''),
                lib = this.$(evt.currentTarget).data('lib');

            this.controller.addNewBlock(lib, name);

            if (!device.ios()) {
                this.controller.navigate('', {
                        trigger: true
                });
            }

            var deviceLocal = this.controller.layout.getDeviceState();

            if (deviceLocal === 'mobile' || deviceLocal === 'tablet') {
                this.controller.layout.hideSwipeMenu();
            }
        },
        /**
         * View block's preview
         * @class QoobMenuBlocksPreviewView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
            this.group = options.group;
        },
        /**
         * Render menu groups
         * @returns {Object}
         */
        render: function() {
            var data = {
                "group": this.group,
                "device": this.controller.layout.getDeviceState(),
                "items": this.storage.getBlocksByGroup(this.group.id) //FIXME: moveto utils
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-blocks-preview'))(data));

            return this;
        }
    }
);
