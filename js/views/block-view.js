/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BlockView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-inner",
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
        this.on('render', this.afterRender);
    },
    render: function () {
        console.log(1);
        var self = this;
        
        // loader page +1
        builder.loader.add(1);
        
        builder.storage.getTemplate(this.model.get('template'), function (err, template) {
            var item = _.findWhere(builder.storage.builderData.items, {id: self.model.get('template')});
            var tplAdapter = item.config.blockTemplateAdapter || builder.options.blockTemplateAdapter;

            self.model.template = BuilderExtensions.templating[tplAdapter](template);

            var data = self.model.toJSON();
            for (var i in data) {
                if (data[i] instanceof Backbone.Collection) {
                    data[i] = JSON.parse(JSON.stringify(data[i]));
                }
            }

            self.renderTemplate = self.model.template(data);

            var iframe = builder.builderLayout.viewPort.getWindowIframe();
            iframe.jQuery(self.$el).html(self.renderTemplate);
            self.afterRender();
//            self.trigger('afterRender');

            // add BlockView to storage
            builder.storage.addBlockView(self);
            
            // loader page -1
            builder.loader.sub();
            
            // when added block hide loader
            builder.loader.hideWaitBlock();
            console.log('render');
            console.log(2);
            return self;
        });

        return this;
    },
    /**
     * Trigger change builder blocks after render
     */
    afterRender: function () {
        builder.builderLayout.viewPort.triggerBuilderBlock();
    },
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

    