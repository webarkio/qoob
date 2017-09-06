/**
 * Create view settings for block
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobMenuGroupsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobMenuGroupsView.prototype */
    {
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
        },
        clickLinkGroupActive: function(evt) {
            evt.preventDefault();
            $(evt.currentTarget).removeClass('group-list__link-active');
            this.controller.navigate('index', {
                trigger: true,
                replace: true
            });
        },
        /**
         * Render menu groups
         * @returns {Object}
         */
        render: function() {
            var data = {
                "groups_arr": this.groups
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-groups-preview'))(data));

            return this;
        }
    });