/**
 * Manage libs view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobManageLibsView = Backbone.View.extend(
    /** @lends QoobManageLibsView.prototype */
    {
        events: {
            'click .add-ibrary': 'clickAddLibrary',
            'click .update-library': 'clickUpdateLibrary',
            'click .remove-library': 'clickRemoveLibrary'
        },
        id: "manage-libs",
        attributes: function() {
            return {
                'class': "manage-libs settings",
                'data-side-id': "manage-libs"
            };
        },
        /**
         * View settings
         * @class QoobManageLibsView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
        },
        clickAddLibrary: function(evt) {
            var url = this.$el.find('input[name="url"]').val();

            if (url.length > 0) {
                this.controller.addLibrary(url, function(state) {
                    self.showPhraseReload();
                    console.log('You need reload page');
                });
            }
        },
        clickUpdateLibrary: function(evt) {
            evt.preventDefault();

            var libraries = this.storage.librariesData;

            var findLib = _.find(libraries, function(item) {
                return item.name == elem.data('lib-name');
            });

            this.controller.updateLibrary(findLib.name, findLib.url, function(state) {
                self.showPhraseReload();
                console.log('You need reload page');
            });
        },
        clickRemoveLibrary: function(evt) {
            evt.preventDefault();
            var self = this;
            var elem = this.$(evt.currentTarget);
            this.controller.removeLibrary(elem.data('lib-name'), function(state) {
                elem.parents('.library').remove();
                self.showPhraseReload();
                console.log('You need reload page');
            });
        },
        showPhraseReload: function() {
            this.$el.find('.phrase-reload-page').show();
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            var data = {
                'back': this.storage.__('back', 'Back'),
                'libraries': this.storage.librariesData
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-manage-libs-preview'))(data));

            return this;
        }
    });