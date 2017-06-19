/**
 * Create view for import/export in qoob layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobImportExportView = Backbone.View.extend( // eslint-disable-line no-unused-vars
    /** @lends QoobImportExportView.prototype */
    {
        tagName: 'div',
        id: 'qoob-import-export',
        events: {
            'click .save-changes': 'clickSaveChanges'
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
         * Save new page data
         * @param {Object} evt
         */
        clickSaveChanges: function(evt) {
            evt.preventDefault();

            if (this.controller.pageModel.get('blocks').models.length > 0) {
                this.controller.removePageData();
            }
    
            var data = JSON.parse(this.$el.find('.qoob-import-export-textarea').val());
            
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
            this.$el.find('#qoob-import-export-window').modal('show');
            // listen event "blocks_loaded"
            this.controller.layout.viewPort.once('blocks_loaded', function() {
                self.$el.find('#qoob-import-export-window').modal('hide');
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
                "save_changes": this.storage.__('save_changes', 'Save changes'),
                "page_data": JSON.stringify(json)
            }));
            return this;
        }
    });
