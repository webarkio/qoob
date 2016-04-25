var Fields = Fields || {};
Fields.accordion_item_flip = Backbone.View.extend(
/** @lends Fields.accordion_item_front.prototype */{
    className: "settings-item settings-accordion",
    accordionItemFrontTpl : null,
    accordionItemFrontSettingTpl : null,
    events: {
        'click .cross-delete': 'deleteModel',
        'click .title_accordion.inner-settings-flip' : 'showSettings',
    },
    /**
     * View field accordion item
     * needed for field accordion
     * @class Fields.image
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (options) {
        this.$el.attr('data-model-id', this.model.id);

        var self = this;
        builder.storage.getBuilderTemplate('field-accordion-item-flip', function(err, data){
            self.accordionItemFrontTpl = _.template(data);
        });

        builder.storage.getBuilderTemplate('field-accordion-item-flip-setting', function(err, data){
            self.accordionItemFrontSettingTpl = _.template(data);
        });
    },

    /**
     * Show accordion item's settings
     * @returns {Object}
     */
    
    showSettings: function (evt) {
        var blockId;
        var parentId = jQuery(evt.target).closest('.inner-settings').attr('id');
        
        if (parentId == "inner-settings-accordion") {
            blockId = parentId;
        }else {
            blockId = jQuery(evt.target).closest('.settings').attr('id').match(new RegExp(/(\d)+/))[0];
        }

        var settingsView = new FieldsView({model: this.model});
        settingsView.config = this.config;
        
        var htmldata = {
            "blockId" : blockId,
            "classname" : 'inner-accordion-'+this.model.id
        }

        builder.menu.showInnerSettings(blockId, this.accordionItemFrontSettingTpl( htmldata ));
        jQuery('.inner-accordion-'+this.model.id).append(settingsView.render().el);
    },
    
    /**
     * Render filed accordion_item
     * @returns {Object}
     */
    render: function () {
        var items = [];
        var settingsView = new FieldsView({model: this.model});
        var htmldata = {
            "image" : settingsView.model.get('image'),
            "title" : settingsView.model.get('title'),
        }
        // change preview accordion item
        this.listenTo(settingsView.model, 'change', function (){
            this.$el.find("h3 span.text").html(this.model.get('title'));
            this.$el.find("h3 span.preview_img img").prop('src', this.model.get('image'));
        });

        items.push(this.accordionItemFrontTpl( htmldata ));

        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(items);
        }
        return this;
    },
    /**
     * Removes the view from the DOM and unbinds all events.
     * @param {Object} e
     */
    deleteModel: function (e) {
        e.preventDefault();
        this.model.stopListening();
        this.model.trigger('destroy', this.model, this.model.collection);
        this.remove();
        this.model.trigger('change');
    }
});

