/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuGroupsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuGroupsView.prototype */
    {
        name: 'catalog-groups', // name View
        className: 'catalog-groups',
        attributes: function() {
            return {
                'data-side-id': 'catalog-groups'
            };
        },
        events: {
            'click .group-list__link-active': 'clickLinkGroupActive'
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
            this.side = this;
        },
        clickLinkGroupActive: function(evt) {
            evt.preventDefault();
            jQuery(evt.currentTarget).removeClass('group-list__link-active');
            this.controller.navigate('', {
                trigger: true,
                replace: true
            });
        },
        /**
         * Render menu groups
         * @returns {Object}
         */
        render: function() {
            this.$el.html([
                this.controller.layout.toolbar.render().el,
                _.template(this.storage.getSkinTemplate('menu-groups-preview'))({ "groups_arr": this.groups })
            ]);

            return this;
        }
    });