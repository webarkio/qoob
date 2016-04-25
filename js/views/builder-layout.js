/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderLayout = Backbone.View.extend(
/** @lends BuilderView.prototype */{
    tpl : null,
    postId : null,

    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
        var self=this;
        data.storage.getBuilderTemplate('builder', function(err, data){
            self.tpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        //Creating dependent ciews
        var builderToolbar = new BuilderToolbarView();
        var builderMenu = new BuilderMenuView();      
        var builderViewport = new BuilderViewportView();
        
        //Creating layout
        this.$el.html(this.tpl({"postId" : builder.storage.pageId}));
        this.$el.find('#builder').append(builderToolbar.el);
        this.$el.find('#builder').append(builderMenu.el);
        this.$el.find('#builder-content').append(builderViewport.el);
        return this;
    }
});