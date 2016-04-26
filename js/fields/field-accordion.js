var Fields = Fields || {};
Fields.accordion = Backbone.View.extend(
/** @lends Fields.accordion.prototype */{
    className: "settings-item",
    uniqueId: null,
    accordionTpl : null,
    classNameItem: "",
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
        var self = this;
        builder.storage.getBuilderTemplate('field-accordion', function(err, data){
            self.accordionTpl = _.template(data);
        });
    },
    /**
     * Change position blocks accordion
     * @param {Object} event
     * @param {integer} position
     */
    changePosition: function (event, position) {
        var values = this.getValue();
        var blocks = jQuery('#' + this.getUniqueId()).children( '.settings-accordion');

        blocks.each(function (index, listItem) {
            var dataId = jQuery(listItem).data('model-id');
            var model = values.get(dataId);
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
        return this.uniqueId = this.uniqueId || _.uniqueId('accordion-');
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

        var model = builder.utils.createModel(data);

        values.add(model);

        var item = new Fields[this.classNameItem]({model: model});
        
        item.config = settings;

        this.model.listenTo(item.model, "change", function () {
            this.trigger('change');
            self.changePosition();
        });
        
        item.model.set('order', (values.models ? values.models.length-1 : 0));


        jQuery("#" + this.getUniqueId()).append(item.render().el);
        jQuery("#" + this.getUniqueId()).accordion("refresh");
        values.trigger('change');
    },
    
    /**
     * Render filed accordion
     * @returns {Object}
     */
    render: function () {        
        var values = this.getValue(),
            settings = this.config.settings,
            items = [],
            value_models = values.models;
        // sort accordion settings
        value_models = _.sortBy(value_models, function(model){
            return model.get('order');
        });
        
        if(this.config.viewType === undefined || this.config.viewType === "expand"){
            this.classNameItem = 'accordion_item_expand';
        }else{
            this.classNameItem = 'accordion_item_flip';
        }
        
        for (var i = 0; i < value_models.length; i++) {
            var item = new Fields[this.classNameItem]({model: value_models[i], frontsettings: this.config.frontsettings});
            item.config = settings;
            
            items.push(item.render().el);
            
            this.model.listenTo(item.model, "change", function () {
                this.trigger('change');
            });

//            
//            values.listenTo(item.model, "change", function () {
//                self.changePosition();
//            });
        }
        var htmldata = {
            "label" : this.config.label,
            "uniqueId" : this.getUniqueId(),
            "settings" : settings
        }
   
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.accordionTpl( htmldata )).find('#'+ this.getUniqueId()).append(items);
        }
        return this;
    }
});