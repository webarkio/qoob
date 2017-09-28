/*global isMobile*/
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
            'click .preview-block': 'clickPreviewBlock'
        },
        attributes: function() {
            return {
                'data-side-id': this.id
            };
        },
        clickPreviewBlock: function(evt) {
            var name = evt.currentTarget.id.replace('preview-block-', ''),
                lib = this.$(evt.currentTarget).data('lib');

            this.controller.addNewBlock(lib, name);

            if (isMobile.phone) {
                this.controller.hideSwipeMenu();
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
                "items": this.storage.getBlocksByGroup(this.group.id) //FIXME: moveto utils
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-blocks-preview'))(data));

            return this;
        }
    }
);
