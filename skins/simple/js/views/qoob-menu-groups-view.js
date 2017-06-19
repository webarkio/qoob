/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuGroupsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuGroupsView.prototype */
    {
        id: "catalog-groups",
        attributes: function() {
            return {
                'data-side-id': 'catalog-groups'
            };
        },
        /**
         * View menu groups
         * @class QoobMenuGroupsView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.groups = options.groups;
            this.controller = options.controller;
        },
        /**
         * Render menu groups
         * @returns {Object}
         */
        render: function() {
            var data = {
                "groups_arr": this.groups,
                "libs": this.storage.librariesData,
                "curLib": this.storage.currentLib,
                "all_themes": this.storage.__('all_libs', 'All Libs')
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-groups-preview'))(data));

            return this;
        }
    });
