var PageModel = Backbone.Model.extend({
    initialize: function () {
        this.blocks = new Backbone.Collection();
    },
    addBlock: function (model, afterId) {
        afterId = afterId || '';
        if (afterId) {
            this.blocks.models.splice(afterId, 0, model);
        } else {
            this.blocks.add(model);
        }
        this.trigger('block_add', model);
    },
    load: function () {
        var self = this;
        var data = builder.storage.pageData;

        for (var i = 0; i < data.length; i++) {
            var model = BuilderUtils.createModel(data[i]);
            this.addBlock(model);
        }
    }
});