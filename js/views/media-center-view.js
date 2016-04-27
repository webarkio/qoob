/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var MediaCenterView = Backbone.View.extend(
/** @lends BuilderView.prototype */{
    tagName: "div",
    className: "settings menu-block",
    tpl : null,
    parentId: null,
    events: {
        'click .btn-upload.btn-builder': 'lalala',
        'change this': 'tutu'
    },

    /**
     * Set setting's id
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    attributes : function () {
        return {
            id : "settings-block-media"
        };
    },
    tutu: function (events) {
        console.log(11);
    },
    lalala: function () {
        this.dispose();
    },
    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
        this.parentId = data.parentId;
        this.curSrc = data.curSrc; 
        this.blockId = data.blockId; 
        this.assets = data.assets;
       // field-accordion-item-flip-view
        var self = this;
        var self = this;
        builder.storage.getBuilderTemplate('field-image-setting', function(err, data){
            self.tpl = _.template(data);
        });
        this.render();
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        var id;
        if(this.parentId === undefined){
            id = "settings-block-" + this.model.id;
        }else{
            id = "settings-block-" + this.parentId;
        };
        //Creating layout
        this.$el.html(this.tpl({
            "id" : id,
            "curSrc" : this.curSrc, 
            "blockId" : this.blockId, 
            "assets" : this.assets,
            "self" : this 
        }));
        return this;
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