var PageModel = Backbone.Model.extend({
    initialize: function () {
        //FIXME: add page id
        this.set('blocks' , new Backbone.Collection());
    },
    addBlock: function (model, afterBlockId) {
        afterBlockId = afterBlockId || null;
        if (afterBlockId) {
            this.get('blocks').models.splice(afterBlockId, 0, model);
        } else {
            this.get('blocks').add(model);
        }
        this.trigger('block_add', model, afterBlockId);
    }
    // load: function () {
    //     var self = this;
    //     var data = builder.storage.pageData;

    //     for (var i = 0; i < data.length; i++) {
    //         var model = BuilderUtils.createModel(data[i]);
    //         this.addBlock(model);
    //     }
    // }
});