/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderView = Backbone.View.extend(
/** @lends BuilderView.prototype */{
    buidlerTpl : null,
    postId : null,

    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
        var self=this;
        this.postId = data.storage.pageId;
        data.storage.getBuilderTemplate('builder', function(err, data){
            self.buidlerTpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        this.$el.html(this.buidlerTpl({
            "postId" : this.postId
        }));
        return this;
    }
});