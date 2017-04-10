/*global QoobBlockView*/
/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobBlockWrapperView = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    tagName: "div",
    events: {
        'click .qoob-overlay': 'clickStartEditBlock'
    },
    attributes: function() {
        return {
            'id': 'outer-block-' + this.model.id
        };
    },
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
        this.innerBlock = new QoobBlockView({ model: this.model, storage: this.storage, controller: this.controller });
    },
    render: function() {
        var self = this;

        this.innerBlock.once('loaded', function() {
            var droppable = _.template(self.storage.getSkinTemplate('block-droppable-preview'))({ "blockId": self.model.id, "text": this.storage.__('text_droppable_zone', 'Drop here to creative new block') });
            var overlay = _.template(self.storage.getSkinTemplate('block-overlay-preview'))({ "blockId": self.model.id });
            self.controller.layout.viewPort.getWindowIframe().jQuery(self.el).html([droppable, overlay, self.innerBlock.el]);
            self.$el.addClass('content-show content-block-outer');
            self.droppable();

            self.trigger('loaded');

            // set focus on iframe
            self.controller.layout.viewPort.getWindowIframe().focus();
        });
        //Add 'please wait' template while loading
        self.$el.html(_.template(this.storage.getSkinTemplate('block-pleasewait-preview'))({ "text": this.storage.__('block_pleasewait_preview', 'Please wait') }));

        this.innerBlock.render();
        return this;
    },
    clickStartEditBlock: function() {
        if (this.controller.layout.menu.getSettingsView(this.model.id)) {
            this.controller.navigate('edit/' + this.model.id, { trigger: true });
        }
    },
    droppable: function() {
        var self = this;
        this.$el.find('#droppable-' + self.model.id).droppable({
            activeClass: "ui-droppable-active",
            hoverClass: "ui-droppable-hover",
            tolerance: "pointer",
            drop: function(event, ui) {
                var dropElement = jQuery(this);
                //get block name
                var blockName = ui.draggable.attr("id").replace("preview-block-", "");
                //get after id
                var beforeId = dropElement.attr("id").replace("droppable-", "");
                // get lib
                var blockLib = ui.draggable.data('lib');
                // add new block
                self.controller.addNewBlock(blockLib, blockName, beforeId);
            }
        });
    },
    /**
     * Remove view
     */
    dispose: function() {
        var self = this;

        // add animation when remove block
        var animationEnd = 'animationend AnimationEnd';

        this.$el.addClass('content-hide').one(animationEnd, function() {
            // Removes a view from the DOM
            self.$el.remove();

            // unbind events that are
            // set on this view
            self.off();

            // remove all models bindings
            // made by this view
            self.model.off(null, null, self);
        });
    }
});
