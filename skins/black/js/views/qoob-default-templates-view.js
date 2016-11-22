/**
 * Create view for default templates
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobDefaultTemplatesView = Backbone.View.extend({
    tagName: "div",
    className: 'qoob-templates',
    events: {
        'click .template': 'clickTemplateBlock'
    },
    initialize: function (options) {
        this.storage = options.storage;
        this.templates = options.templates;
        this.controller = options.controller;
    },
    render: function () {
        this.$el.html(_.template(this.storage.getSkinTemplate('block-default-templates'))({"templates": this.templates}));
        return this;
    },
    clickTemplateBlock: function (evt) {
        var id = jQuery(evt.currentTarget).data('id');
                
        for (var i = 0; i < this.templates.length; i++) {
            if (this.templates[i].id === id) {
                this.controller.load(this.templates[i].blocks);
            }
        }
    }
});