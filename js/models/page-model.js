var PageModel = Backbone.Model.extend({
    initialize: function () {
        //FIXME: add page id
        this.set('blocks', new Backbone.Collection());
    },
    addBlock: function (model, afterBlockId) {
        afterBlockId = afterBlockId || null;
        if (afterBlockId) {
            this.get('blocks').models.splice(afterBlockId, 0, model);
        } else {
            this.get('blocks').add(model);
        }
        this.trigger('block_add', model, afterBlockId);
    },
    deleteBlock: function (model) {
        this.trigger('block_delete', model.id);
        this.get('blocks').remove(model);
    },
    load: function (blocks) {
        for (var i = 0; i < blocks.length; i++) {
            var model = BuilderUtils.createModel(blocks[i]);
            this.addBlock(model);
        }
    },
    moveUp: function (model) {
        var index = this.get('blocks').indexOf(model);
        
        if (index > 0) {
            this.swap(index, index - 1);
            this.trigger('block_moveup', model.id);
        }
    },
    moveDown: function (model) {
        var index = this.get('blocks').indexOf(model);
    
        if (index < this.get('blocks').models.length) {
            this.swap(index, index + 1);
            this.trigger('block_movedown', model.id);
        }
    },
    swap: function (indexA, indexB) {
        this.get('blocks').models[indexA] = this.get('blocks').models.splice(indexB, 1, this.get('blocks').models[indexA])[0];
    }
});