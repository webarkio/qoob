/**
 * Create view block's preview
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuBlocksPreviewView = Backbone.View.extend(
    /** @lends QoobMenuGroupsView.prototype */
    {
        className: 'catalog-templates menu-block',
        events:{
            'click .preview-block': 'clickPreviewBlock'
        },
        clickPreviewBlock: function(evt){
            this.controller.addNewBlock(evt.currentTarget.id.replace('preview-block-',''));
        },

        /**
         * View menu groups
         * @class QoobMenuGroupsView
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
                "items": this.storage.getBlocksByGroup(this.group.id)  //FIXME: moveto utils
            };

            this.$el.html(_.template(this.storage.qoobTemplates['menu-blocks-preview'])(data));

            return this;
        }
    });
