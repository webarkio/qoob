/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BlockWrapperView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-outer",
    events:{
        'click .overlay': 'clickStartEditBlock'
    },

    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
        this.innerBlock = new BlockView({ model: this.model, storage:this.storage, controller: this.controller });
    },
    render: function() {
        var data = {};
        var droppable = _.template(this.storage.builderTemplates['block-droppable'])({ "blockId": this.model.id });
        var overlay = _.template(this.storage.builderTemplates['block-overlay'])({ "blockId": this.model.id });
        
        //_.template(this.storage.builderTemplates['block-wrapper'])(data)
        this.$el.html([droppable, overlay, this.innerBlock.render().el]);
        return this;
    },
    clickStartEditBlock: function(evt){
        this.controller.navigate('edit/'+this.model.id, {trigger: true});
        //startEditBlock(this.model.id);
    },

    /**
     * Remove view
     */
    dispose: function() {
        // same as this.$el.remove();
        this.remove();

        // unbind events that are
        // set on this view
        this.off();

        // remove all models bindings
        // made by this view
        this.model.off(null, null, this);
    }
});
