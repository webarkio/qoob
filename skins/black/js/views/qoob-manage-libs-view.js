/**
 * Manage libs view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobManageLibsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobManageLibsView.prototype */
    {
        events: {
            'click .add-ibrary': 'clickAddLibrary',
            'click .update-library': 'clickUpdateLibrary',
            'click .remove-library': 'clickRemoveLibrary',
            'click .reload-page': 'clickReloadPage'
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
            evt.preventDefault();
            var self = this,
                url = this.$el.find('input[name="url"]').val();

            if (url.length > 0) {
                this.controller.showMenuOverlay();
                this.controller.addLibrary(url, function(error) {
                    self.controller.hideMenuOverlay();
                    if (error) {
                        console.error(error);
                    } else {
                        self.showPhraseReload();
                    }


                });
            }
        },
        clickUpdateLibrary: function(evt) {
            evt.preventDefault();
            var self = this,
                elem = this.$(evt.currentTarget),
                libraries = this.storage.librariesData;

            var findLib = _.find(libraries, function(item) {
                return item.name == elem.parent().data('lib-name');
            });

            this.controller.showMenuOverlay();

            this.controller.updateLibrary(findLib.name, findLib.url, function() {
                self.showPhraseReload();
                self.controller.hideMenuOverlay();
            });
        },
        clickRemoveLibrary: function(evt) {
            evt.preventDefault();
            var self = this,
                elem = this.$(evt.currentTarget);

            this.controller.showMenuOverlay();
            this.controller.removeLibrary(elem.parent().data('lib-name'), function() {
                elem.parents('.library').remove();
                self.showPhraseReload();
                self.controller.hideMenuOverlay();
            });
        },
        showPhraseReload: function() {
            this.$el.find('.phrase-reload-page').show();
        },
        clickReloadPage: function() {
            location.reload();
        },
        /**
         * Render settings
         * @returns {Object}
         */
        render: function() {
            var data = {
                'back': this.storage.__('back', 'Back'),
                'add_url_library': this.storage.__('add_url_library', 'Add url library'),
                'enter_url_library': this.storage.__('enter_url_library', 'enter url library'),
                'libraries_lng': this.storage.__('libraries', 'Libraries'),
                'you_need_to': this.storage.__('you_need_to', 'You need to'),
                'reload_page': this.storage.__('reload_page', 'reload page'),
                'libraries': this.storage.librariesData
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-manage-libs-preview'))(data));

            return this;
        }
    });
