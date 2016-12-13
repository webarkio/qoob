/**
 * Create view for default templates
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var QoobDefaultTemplatesView = Backbone.View.extend({
    tagName: "div",
    className: 'qoob-templates',
    events: {
        'click .template img, .template .title': 'clickChoiceTemplateBlock',
        'click .remove': 'clickRemoveTemplateBlock'
    },
    initialize: function(options) {
        this.storage = options.storage;
        this.controller = options.controller;

        this.listenTo(this.storage.defaultTemplatesCollection, 'add remove', this.render);
    },
    render: function() {
        this.$el.html(_.template(this.storage.getSkinTemplate('block-default-templates'))({
            "templates": this.storage.defaultTemplatesCollection.toJSON(),
            "block_default_templates_text": this.storage.__('block_default_templates_text', 'Or you can choose one of templates'),
            "text_default_blank": this.storage.__('block_default_blank', "This is blank page, you can click on block preview to add block")
        }));

        return this;
    },
    clickChoiceTemplateBlock: function(evt) {
        var self = this;
        var id = jQuery(evt.currentTarget).parents('[data-id]').data('id');
        this.storage.defaultTemplatesCollection.each(function(item, index){
            if (item.id === id) {
                self.controller.load(item.get('blocks'));
            }
        });
    },
    clickRemoveTemplateBlock: function(evt) {
        evt.preventDefault();
        var self = this;
        var id = jQuery(evt.currentTarget).data('id');
        this.controller.removeTemplateBlock(id);
    }
});