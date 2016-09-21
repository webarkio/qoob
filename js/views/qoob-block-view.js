/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobBlockView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-inner",
    /**
     * Saved HTML template before it was added to DOM
     * @type {String}
     */
    renderedTemplate: null,
    /**
     * @param  {Object}
     * @return {[type]}
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
        this.listenTo(this.model, 'change', this.render);
    },
    render: function(event) {
        var self = this;
        //Start loading template for block
        this.storage.getBlockTemplate(self.model.get('template'), function(err, template){
            var config = self.storage.getBlockConfig(self.model.get('template'));
            var tplAdapterType = config.blockTemplateAdapter || self.storage.getDefaultTemplateAdapter();
            var tplAdapter = QoobExtensions.templating[tplAdapterType];
            self.renderedTemplate = tplAdapter(template)(self.model.toJSON());
            self.controller.layout.viewPort.getWindowIframe().jQuery(self.el).html(self.renderedTemplate);
            self.trigger('loaded');
            self.controller.triggerIframe();
        });
        return self;
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
