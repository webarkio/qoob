/**
 * Create view block's preview
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuBlocksPreviewView = Backbone.View.extend(
    /** @lends BuilderMenuGroupsView.prototype */
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
         * @class BuilderMenuGroupsView
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
                "items": _.where(this.storage.builderData.items, {groups:this.group.id})  //FIXME: moveto utils
            };

            this.$el.html(_.template(this.storage.builderTemplates['menu-blocks-preview'])(data));

            return this;
        }
    });
