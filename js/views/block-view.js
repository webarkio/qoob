/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BlockView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-inner",
    renderedTemplate: '',
    // attributes:function(){
    //     return {
    //         id: 'block-inner-'+this.model.id
    //     }
    // },
    initialize: function (options) {
        this.template = options.template;//compiled template
        this.storage = options.storage;
        this.controller = options.controller;
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        var self = this,
                item = _.findWhere(this.storage.builderData.items, {id: this.model.get('template')}),
                tplAdapterType = item.blockTemplateAdapter || this.controller.layout.viewPort.getDefaultTemplateAdapter(),
                tplAdapter = BuilderExtensions.templating[tplAdapterType];
       
        this.$el.html(this.storage.builderTemplates['block-pleasewait']);

        this.storage.getTemplate(this.model.get('template'), function (err, template) {
            var template = tplAdapter(template);
            
            self.$el.html(template(self.model.toJSON()));
            self.storage.addBlockView(self);
            
        });


//        var iframe = builder.builderLayout.viewPort.getWindowIframe();
        //iframe.jQuery(this.$el).html(this.renderTemplate);
//        this.afterRender();
//            self.trigger('afterRender');

        // add BlockView to storage
//        builder.storage.addBlockView(this);

        // loader page -1
        //      builder.loader.sub();

        // when added block hide loader
        //    builder.loader.hideWaitBlock();

        return this;
    },
    /**
     * Trigger change builder blocks after render
     */
    // afterRender: function () {
    //     builder.builderLayout.viewPort.triggerBuilderBlock();
    // },
    /**
     * Remove view
     */
    dispose: function () {
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

    