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
    initialize: function (builder) {
        var self=this;
        self.builder = builder;
        self.builder.toolbar = new BuilderToolbarView(this.builder);
        self.builder.menu = new BuilderMenuView(this.builder);      
        self.builder.viewPort = new BuilderViewportView(this.builder);
        
        self.builder.storage.getBuilderTemplate('builder', function(err, data){
            self.tpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {   
        //Creating layout
        this.$el.html(this.tpl({"postId" : this.builder.storage.pageId}));
        this.$el.find('#builder').append(this.builder.toolbar.el);
        this.$el.find('#builder').append(this.builder.menu.el);
        this.$el.find('#builder-content').append(this.builder.viewPort.el);
        return this;
    }
});