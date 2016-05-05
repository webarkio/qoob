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
    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.parentId = options.parentId;
        this.curSrc = options.curSrc; 
        this.blockId = options.blockId; 
        this.assets = options.assets;
        this.storage = options.storage;
        this.tpl = _.template(this.storage.builderTemplates['field-image-setting']);
        
        this.render();
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        var backId = "settings-block-" + this.model.id;

        //Creating layout
        this.$el.html(this.tpl({
            "backId" : backId,
            "curSrc" : this.curSrc, 
            "assets" : this.assets,
        }));
        return this;
    },
    /**
     * Remove view
     */
    dispose: function () {
        // same as this.$el.remove();
        this.remove();

        // unbind events that are
        // set on this view
        this.off();
    }
});