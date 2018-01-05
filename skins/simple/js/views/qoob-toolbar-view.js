/**
 * Create view for toolbar in qoob layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */

var QoobToolbarView = Backbone.View.extend({ // eslint-disable-line no-unused-vars
    /** @lends QoobToolbarView.prototype */
    tagName: 'div',
    id: "qoob-toolbar",
    events: {
        'change .control-buttons__button-preview-list': 'changeDeviceMode',
        'click .control-buttons__button-preview': 'clickPreviewMode',
        'click .control-buttons__button-save': 'clickSave',
        'click .pages-dropdown__backward-button': 'clickBackward',
        'click .autosave-checkbox': 'clickAutosave',
        'click [data-id]': 'clickAction'
    },
    /**
     * View toolbar
     * @class QoobToolbarView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;
    },
    /**
     * Start action custom menu
     * @param {Object} evt
     */
    clickAction: function(evt) {
        evt.preventDefault();
        var id = jQuery(evt.currentTarget).data("id");

        if (typeof this.storage.driver.mainMenu === "function") {
            var menuItem = this.menu.find(function(o) {
                return o.id === id;
            });

            if (menuItem.action) {
                menuItem.action(this);
            }
        }
    },
    /**
     * Show loader autosave
     */
    showSaveLoader: function() {
        this.$el.find('.control-buttons__button-save .save-clock').css('display', 'block');
    },
    /**
     * Hide loader autosave
     */
    hideSaveLoader: function() {
        this.$el.find('.control-buttons__button-save .save-clock').css('display', '');
    },
    //EVENTS
    clickPreviewMode: function() {
        this.controller.setPreviewMode();
    },
    changeDeviceMode: function(evt) {
        this.controller.setDeviceMode(evt.target.value);
    },
    clickSave: function() {
        this.controller.save();
    },
    clickAutosave: function(evt) {
        this.controller.setAutoSave(evt.target.checked);
    },
    clickBackward: function() {
        this.controller.backward();
    },
    /**
     * Render toolbar
     * @returns {Object}
     */
    render: function() {
        var self = this;
        var data = {
            "device": this.controller.layout.getDeviceState(),
            "subDomain": this.storage.driver.subDomain,
            "page": this.storage.driver.page,
            "pages": this.storage.driver.pages,
            "save": this.storage.__('save', 'Save'),
            "desktop": this.storage.__('desktop', 'Desktop'),
            "tablet": this.storage.__('tablet', 'Tablet'),
            "phone": this.storage.__('phone', 'Phone'),
            "autosave": this.storage.__('autosave', 'Autosave'),
            "locale_pages": this.storage.__('pages', 'Pages'),
            "customMenu": []
        };

        if (typeof this.storage.driver.mainMenu === "function") {
            var staticCustomMenu = [{
                "id": "import-export",
                "label": this.storage.__('importExport', 'Import/export'),
                "action": function() { self.controller.showImportExportWindow() },
                "icon": ""
            }, {
                "id": "empty-page",
                "label": this.storage.__('epmtyPage', 'Empty page'),
                "action": function() { self.controller.removePageData() },
                "icon": ""
            }];

            this.menu = this.storage.driver.mainMenu(staticCustomMenu);

            for (var i = 0; i < this.menu.length; i++) {
                var key = Object.keys(this.menu[i].label);
                if (this.storage.translations != null) {
                    this.menu[i].label = this.storage.__(key, this.menu[i].label[key]);
                } else if(_.isObject(this.menu[i].label)) {
                    this.menu[i].label = this.menu[i].label[key];
                }
            }

            data.customMenu = this.menu;
        }

        this.$el.html(_.template(this.storage.getSkinTemplate('qoob-toolbar-preview'))(data));

        // Init select
        this.$el.find('.qoob-select-item').qoobSelect();

        return this;
    }
});