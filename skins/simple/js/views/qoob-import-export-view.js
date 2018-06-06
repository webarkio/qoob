/**
 * Create view for import/export in qoob layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobImportExportView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobImportExportView.prototype */
    {
        id: 'qoob-import-export',
        events: {
            'click .save-changes': 'clickSaveChanges',
            'click .close': 'clickClose',
            'click': 'clickOverlay'
        },
        /**
         * View import/export
         * @class QoobImportExportView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.controller = options.controller;
            this.storage = options.storage;
        },
        /**
         * Close modal window
         */
        clickClose: function() {
            this.$el.removeClass('show');
        },
        /**
         * Close modal window
         * @param {Object} evt
         */
        clickOverlay: function(evt) {
            if (jQuery(evt.target).prop('id') == this.id) {
                this.$el.removeClass('show');
            }
        },
        /**
         * Save new page data
         * @param {Object} evt
         */
        clickSaveChanges: function(evt) {
            evt.preventDefault();
            var data;

            if (this.controller.pageModel.get('blocks').models.length > 0) {
                this.controller.removePageData();
            }

            if (this.$el.find('.qoob-import-export-textarea').val().length == 0) {
                data = { "blocks": []};
            } else {
                data = JSON.parse(this.$el.find('.qoob-import-export-textarea').val());
            }

            this.controller.load(data.blocks);
        },
        /**
         * Show modal window
         */
        showImportExportWindow: function() {
            var self = this;
            // Update page data
            this.render();
            // Show modal window
            this.$el.addClass('show');
            // listen event "blocks_loaded"
            this.controller.layout.viewPort.once('blocks_loaded', function() {
                self.$el.removeClass('show');
            });
        },
        /**
         * Render modal window
         * @returns {Object}
         */
        render: function() {
            var json = JSON.parse(JSON.stringify(this.controller.pageModel.toJSON()));
            json.version = window.QoobVersion;

            this.$el.html(_.template(this.storage.getSkinTemplate('block-import-export-preview'))({
                "page_data_text": this.storage.__('page_data', 'Page data'),
                "cancel": this.storage.__('cancel', 'Cancel'),
                "close": this.storage.__('close', 'Close'),
                "save_changes": this.storage.__('save_changes', 'Save changes'),
                "page_data": JSON.stringify(json)
            }));

            return this;
        }
    });