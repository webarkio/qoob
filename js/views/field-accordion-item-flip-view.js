/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipView = Backbone.View.extend(
/** @lends BuilderView.prototype */{
    tagName: "div",
    className: "settings menu-block",
    tpl : null,
    parentId: null,

    /**
     * Set setting's id
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    attributes : function () {
        return {
            id : "settings-block-" + this.model.id
        };
    },
    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
       this.parentId = data.parentId;
       // field-accordion-item-flip-view
        var self = this;
        builder.storage.getBuilderTemplate('field-accordion-item-flip-view', function (err, data) {
            self.tpl = _.template(data);
        });
        this.render();
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        var id = "settings-block-"+this.parentId;
        var currentId = "settings-block-" + this.model.id;
        //Creating layout
        this.$el.html(this.tpl({"id":id, "currentId": currentId}));
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

        // remove all models bindings
        // made by this view
        this.model.off(null, null, this);
    }
});