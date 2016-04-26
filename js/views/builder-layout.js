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
        self.menu = new BuilderMenuView(this.builder);      
        self.toolbar = new BuilderToolbarView(this.builder);
        self.viewPort = new BuilderViewportView(this.builder);
        
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
        this.$el.find('#builder').append(this.toolbar.el);
        this.$el.find('#builder').append(this.menu.el);
        this.$el.find('#builder-content').append(this.viewPort.el);
        return this;
    }
});