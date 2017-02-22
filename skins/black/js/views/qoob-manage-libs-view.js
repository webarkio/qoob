/**
 * Manage libs view
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobManageLibsView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobManageLibsView.prototype */
    {
        events: {
            'keyup .input-url': 'keyupInput',
            'keydown': 'keyAction',
            'click .add-library': 'clickAddLibrary',
            'click .update-library': 'clickUpdateLibrary',
            'click .remove-library': 'clickRemoveLibrary',
            'click .reload-page': 'clickReloadPage'
        },
        id: "manage-libs",
        attributes: function() {
            return {
                'class': 'manage-libs settings',
                'data-side-id': 'manage-libs'
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
        keyAction: function(evt) {
            if (evt.keyCode == 13) {
                this.$el.find(".add-library").click();
            }
        },
        keyupInput: function(evt) {
            var elem = this.$(evt.currentTarget);
            if (elem.parents('.container-input-add').hasClass('error') && evt.keyCode != 13) {
                elem.parents('.container-input-add').removeClass('error');
            }
        },
        clickAddLibrary: function(evt) {
            evt.preventDefault();
            var self = this,
                elem = this.$(evt.currentTarget),
                url = this.$el.find('input[name="url"]').val();

            if (url.length > 0) {
                this.controller.showLibraryLoader(elem);
                this.controller.addLibrary(url, function(error) {
                    self.controller.hideLibraryLoader(elem);
                    if (error) {
                        elem.parents('.container-input-add').addClass('error');
                    }
                });
            } else {
                elem.parents('.container-input-add').addClass('error');
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

            this.controller.showLibraryLoader(elem);

            this.controller.updateLibrary(findLib.name, findLib.update, function() {
                self.controller.hideLibraryLoader(elem);
            });
        },
        clickRemoveLibrary: function(evt) {
            evt.preventDefault();
            var self = this,
                elem = this.$(evt.currentTarget);

            this.controller.showLibraryLoader(elem);
            this.controller.removeLibrary(elem.parent().data('lib-name'), function() {
                elem.parents('.library').remove();
                self.controller.hideLibraryLoader(elem);
            });
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
                'add_url_library': this.storage.__('add_url_library', 'Add library URL'),
                'enter_url_here': this.storage.__('enter_url_here', 'Enter URL here'),
                'Add': this.storage.__('Add', 'Add'),
                'libraries_lng': this.storage.__('libraries', 'Active libraries'),
                'libraries_attention': this.storage.__('libraries_attention', 'Attention!'),
                'libraries_text_part_1': this.storage.__('libraries_after_adding', 'After adding, updating or deleting the libraries don\'t forget to'),
                'libraries_text_part_2': this.storage.__('libraries_reload', 'reload'),
                'libraries_text_part_3': this.storage.__('libraries_qoob_page_builder', 'qoob page builder.'),
                'lng_delete': this.storage.__('libraries_delete', 'Delete'),
                'lng_update': this.storage.__('libraries_update', 'Update'),
                'libraries': this.storage.librariesData
            };

            this.$el.html(_.template(this.storage.getSkinTemplate('menu-manage-libs-preview'))(data));

            return this;
        }
    });
