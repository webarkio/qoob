/**
 * Create buidler view 
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var AccordionFlipView = Backbone.View.extend(
/** @lends BuilderView.prototype */{
    tagName: "div",
    className: "settings",
    tpl : null,

    /**
     * Set setting's id
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    attributes : function () {
        return {
            id : "settings-block-" + _.uniqueId()
        };
    },
    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
       this.tpl = _.template('<div class="backward"><a href="#" onclick="builder.menu.rotate(""settings-block-'+data.parentId+'"); return false;">Back</a></div>');
       this.render();
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        //Creating layout
        this.$el.html(this.tpl());
        return this;
    }
});