/*global QoobExtensions*/
/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobBlockView = Backbone.View.extend({ // eslint-disable-line no-unused-vars
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
    render: function() {
        var self = this;

        //Start loading template for block
        this.storage.getBlockTemplate(this.model.get('lib'), this.model.get('block'), function(err, template) {
            if (err == 'blockNotFound') {
                self.renderedTemplate = '<div class="empty-block"><div class="empty-block-text">The block ' + self.model.get('block') + ' is not found in the library ' + self.model.get('lib') + '</div></div>';
            } else {
                var config = self.storage.getBlockConfig(self.model.get('lib'), self.model.get('block'));
                var tplAdapterType = config.blockTemplateAdapter || self.storage.getDefaultTemplateAdapter();
                var tplAdapter = QoobExtensions.templating[tplAdapterType];
                self.renderedTemplate = tplAdapter(template)(JSON.parse(JSON.stringify(self.model)));
            }
            self.controller.layout.viewPort.getWindowIframe().jQuery(self.el).html(self.renderedTemplate);
            if (err == 'blockNotFound') {
                self.renderedTemplate = '';
            }
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
