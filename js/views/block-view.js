/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BlockView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-inner",
    initialize: function (options) {
        this.options = options;
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        console.log(1);

        // loader page +1
        builder.loader.add(1);
        var item = _.findWhere(builder.storage.builderData.items, {id: this.model.get('template')});
        var tplAdapter = item.config.blockTemplateAdapter || builder.options.blockTemplateAdapter;

        this.model.template = BuilderExtensions.templating[tplAdapter](this.options.template);

        var data = this.model.toJSON();
        for (var i in data) {
            if (data[i] instanceof Backbone.Collection) {
                data[i] = JSON.parse(JSON.stringify(data[i]));
            }
        }

        this.renderTemplate = this.model.template(data);

        var iframe = builder.builderLayout.viewPort.getWindowIframe();
        iframe.jQuery(this.$el).html(this.renderTemplate);
//        this.afterRender();
//            self.trigger('afterRender');

        // add BlockView to storage
        builder.storage.addBlockView(this);

        // loader page -1
        builder.loader.sub();

        // when added block hide loader
        builder.loader.hideWaitBlock();
        console.log('render');
        console.log(2);

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

    