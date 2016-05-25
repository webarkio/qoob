/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BlockWrapperView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-outer",
    events: {
        'click .overlay': 'clickStartEditBlock'
    },
    attributes: function () {
        return {
            'id': 'outer-block-' + this.model.id
        };
    },
    initialize: function (options) {
        this.storage = options.storage;
        this.controller = options.controller;
        this.innerBlock = new BlockView({model: this.model, storage: this.storage});
    },
    render: function () {
        var self = this;
        this.innerBlock.once('loaded', function () {
            var droppable = _.template(self.storage.builderTemplates['block-droppable-preview'])({"blockId": self.model.id});
            var overlay = _.template(self.storage.builderTemplates['block-overlay-preview'])({"blockId": self.model.id});

            self.$el.addClass('content-show');
            self.controller.layout.viewPort.getWindowIframe().jQuery(self.el).html([droppable, overlay, self.innerBlock.el]);
            // self.$el.html([droppable, overlay, self.innerBlock.el]);
            self.droppable();
            self.trigger('loaded');
        });
        //Add 'please wait' template while loading
        this.$el.html(_.template(this.storage.getBuilderTemplate('block-pleasewait-preview'))());

        this.innerBlock.render();
        return this;
    },
    clickStartEditBlock: function (evt) {
        this.controller.navigate('edit/' + this.model.id, {trigger: true});
    },
    droppable: function () {
        var self = this;
        this.$el.find('#droppable-' + self.model.id).droppable({
            activeClass: "ui-droppable-active",
            hoverClass: "ui-droppable-hover",
            tolerance: "pointer",
            drop: function (event, ui) {
                var dropElement = jQuery(this);
                //get template id
                var templateId = ui.draggable.attr("id").replace("preview-block-", "");
                //get after id
                var beforeId = dropElement.attr("id").replace("droppable-", "");
                // add new block
                self.controller.addNewBlock(templateId, beforeId);
            }
        });
    },
    /**
     * Remove view
     */
    dispose: function () {
        var self = this;
        
        // add animation when remove block
        var animationEnd = 'animationend AnimationEnd';
        this.$el.addClass('content-hide').one(animationEnd, function(){
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
