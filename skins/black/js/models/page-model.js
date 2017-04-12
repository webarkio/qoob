var PageModel = Backbone.Model.extend({ // eslint-disable-line no-unused-vars
    initialize: function() {
        //FIXME: add page id
        this.set('blocks', new Backbone.Collection());
    },
    addBlock: function(model, beforeBlockId) {
        beforeBlockId = beforeBlockId || null;

        if (beforeBlockId) {
            var beforeModel = this.get('blocks').get(beforeBlockId);
            var index = this.get('blocks').indexOf(beforeModel);
            this.get('blocks').add(model, { at: index });
        } else {
            this.get('blocks').add(model, { at: this.get('blocks').length + 1 });
        }
    },
    deleteBlock: function(model) {
        this.get('blocks').remove(model);
    },
    moveUp: function(model) {
        var index = this.get('blocks').indexOf(model);

        if (index > 0) {
            this.swap(index, index - 1);
            this.trigger('block_moveup', model.id);
        }
    },
    moveDown: function(model) {
        var index = this.get('blocks').indexOf(model);

        if (index < this.get('blocks').models.length) {
            this.swap(index, index + 1);
            this.trigger('block_movedown', model.id);
        }
    },
    swap: function(indexA, indexB) {
        this.get('blocks').models[indexA] = this.get('blocks').models.splice(indexB, 1, this.get('blocks').models[indexA])[0];
    }
});
