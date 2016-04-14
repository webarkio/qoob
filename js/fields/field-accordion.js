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
         this.accordionTpl = _.template(builder.storage.getFieldTemplate('field-accordion'));
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

        var model = builder.createModel(data);
        
        var item = new Fields[this.classNameItem]({model: model, frontsettings: this.config.frontsettings});
        
        item.config = settings;

        values.add(model);

        values.listenTo(item.model, "change", function () {
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
            self = this,
            items = [],
            value_models = values.models;
        // sort accordion settings
        value_models = _.sortBy(value_models, function(model){
            return model.get('order');
        });
        
        if(this.config.frontsettings === undefined || this.config.frontsettings === false){
            this.classNameItem = 'accordion_item';
        }else{
            this.classNameItem = 'accordion_item_front';
        } 
        
        for (var i = 0; i < value_models.length; i++) {
            var item = new Fields[this.classNameItem]({model: value_models[i], frontsettings: this.config.frontsettings});
            item.config = settings;
            
            items.push(item.render().el);
            values.listenTo(item.model, "change", function () {
                self.changePosition();
            });
        }
        var htmldata = {
            "label" : this.config.label,
            "uniqueId" : this.getUniqueId(),
            "settings" : settings
        }
   
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.accordionTpl( htmldata ));
            this.$el.find('#'+ this.getUniqueId()).append(items);
        }
        return this;
    }
});