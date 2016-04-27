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
        //Creating layout
        this.$el.html(this.tpl({"id":id}));
        return this;
    }
});