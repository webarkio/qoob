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
     * Set setting's id
     * @class SettingsView
     * @augments Backbone.View
     * @constructs
     */
    attributes : function () {
        return {
            // id : "settings-block-" + this.model.id
        };
    },

    /**
     * View buider
     * @class BuilderView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (data) {
        this.postId = data.storage.pageId;
        jQuery.get( data.storage.builderViewFolderUrl + '/builder.html', function (data) {
                this.buidlerTpl = _.template(data);
                this.render();
        }.bind(this), 'html');
    },
    /**
     * Render builder view
     * @returns {Object}
     */
    render: function () {
        var data = {
            "postId" : this.postId
        }

        this.$el.html(this.buidlerTpl(data));
        return this;
    }
});