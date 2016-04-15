/**
 * Create view for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BlockView = Backbone.View.extend({
    tagName: "div",
    className: "content-block-inner",
    initialize: function () {
//        this.$el.attr('data-model-id', this.model.id);
        this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
        var data = this.model.toJSON();
        for (var i in data) {
            if (data[i] instanceof Backbone.Collection) {
                data[i] = data[i].toJSON();
            }
        }

        this.render_template = this.template(data);

        var iframe = builder.viewPort.getWindowIframe();
        iframe.jQuery(this.$el).html(this.render_template);
        this.afterRender();
        this.trigger('afterRender');

        // add BlockView to storage
        builder.storage.addBlockView(this);

        return this;
    },
    /**
     * Trigger change builder blocks after render
     */
    afterRender: function () {
        builder.viewPort.triggerBuilderBlock();
    },
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

    