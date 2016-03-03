var Fields = Fields || {};
Fields.accordion = Backbone.View.extend(
/** @lends Fields.accordion.prototype */{
    className: "settings-item",
    events: {
        'click .add-block': 'addNewItem',
        'drop': 'changePosition'
    },
    /**
     * View field accordion
     * @class Fields.accordion
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
    },
    /**
     * Change position blocks accordion
     * @param {Object} event
     * @param {integer} position
     */
    changePosition: function (event, position) {
        var values = this.getValue();
        var blocks = jQuery('#' + this.getUniqueId()).find('.settings-accordion');

        blocks.each(function (index, listItem) {
            var dataId = jQuery(listItem).data('model-id');
            var model = _.findWhere(values.models, {id: dataId});
            model.set('order', jQuery(listItem).index()-1);
        });
    },
    /**
     * Get value field accordion
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Get unique id
     * @returns {String}
     */
    getUniqueId: function () {
        return "accordion-" + this.model.id;
    },
    /**
     * Create filed accordion
     * @returns {String}
     */
    create: function () {
        var values = this.getValue(),
                settings = this.config.settings;

        var items = [];
        var value_models = values.models;
        
        // sort accordion settings
        value_models = _.sortBy(value_models, function(model){
            console.log(model.get('order'));
            return model.get('order');
        });       

        for (var i = 0; i < value_models.length; i++) {
            var item = new Fields['accordion_item']({model: value_models[i]});
            item.config = settings;
            items.push(item.render().el);
        }       

        var add_block = jQuery('<div class="add-block btn-builder">Add component</div>');

        var sortable = '<script type="text/javascript"> jQuery("#' + this.getUniqueId() + '").accordion({' +
                'header: "> div > h3 "' +
                ',collapsible: true}).sortable({' +
                'items: ".settings-accordion",' +
                'axis: "y",' +
                'handle: "h3",' +
                'start: function(event, ui) {' +
                'builder.iframe.getIframeContents().find(".droppable").css("visibility", "hidden");' +
                'if (jQuery(this).find(".tinyMCE").length) {' +
                'jQuery(this).find(".tinyMCE").each(function(){' +
                    'try {tinymce.execCommand( "mceRemoveEditor", false, jQuery(this).attr("id") ); } catch(e){}' +
                '});' +
                '}' +
                '},' +
                'stop: function(event, ui) {' +
                'ui.item.trigger("drop", ui.item.index());' +
                // IE doesn't register the blur when sorting
                // so trigger focusout handlers to remove .ui-state-focus
                'ui.item.children( "h3" ).triggerHandler( "focusout" );' +
                // Refresh accordion to handle new order
                'jQuery( this ).accordion( "refresh" );' +
                'builder.iframe.getIframeContents().find(".droppable").removeAttr("style");' +
                // Refresh tinyMCE
                'if (jQuery(this).find(".tinyMCE").length) {' +
                'jQuery(this).find(".tinyMCE").each(function(){' +
                    'try { tinymce.execCommand( "mceAddEditor", true, jQuery(this).attr("id") ); } catch(e){}' +
                 '});' +
                '}' +
                '}' +
                '}); </script>';

        var block = jQuery('<div id="' + this.getUniqueId() + '"></div>');
        
        if (settings.length == 1 && settings[0].type == 'image') {
            block.addClass('without-title');
        }

        block.append('<div class="title">' + this.config.label + '</div>');
        block.append(items);

        return [block, add_block, sortable];
    },
    /**
     * Add new item to accordion
     * @param {Object} e
     */
    addNewItem: function (e) {
        e.preventDefault();
        var self = this;
        var values = this.getValue();
        var settings = this.config.settings;

        var settingsParams = [];
        for (var i in settings) {
            settingsParams.push({'name': settings[i].name, 'default': settings[i].default});
        }

        var data = [];
        for (var i = 0; i < settingsParams.length; i++) {
            data[settingsParams[i].name] = settingsParams[i].default;
        }

        var model = builder.createModel(data);

        var item = new Fields['accordion_item']({model: model});        
        item.config = settings;

        values.add(model);

        values.listenTo(item.model, "change", function () {
            this.trigger('change');
            self.changePosition();
        });

        item.model.set('order', (values.models ? values.models.length : 0));

        jQuery("#" + this.getUniqueId()).append(item.render().el);
        jQuery("#" + this.getUniqueId()).accordion("refresh");
        values.trigger('change');
    },
    /**
     * Render filed accordion
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});