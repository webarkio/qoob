/*global QoobFieldsView */
/**
 * Create accordion item expand view 
 * 
 * @type @exp;QoobFieldsView@call;extend
 */
var Fields = Fields || {};
Fields.accordion_item_expand = QoobFieldsView.extend( // eslint-disable-line no-unused-vars
    /** @lends Fields.accordion_item.prototype */
    {
        className: "field-accordion__settings",
        events: {
            'click .inner-settings-expand': 'showSettings',
        },
        attributes: function() {
            return {
                'data-side-id': this.model.id
            };
        },
        /**
         * View field accordion item
         * needed for field accordion
         * @class Fields.accordion_item_expand
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.parent = options.parent;
            QoobFieldsView.prototype.initialize.call(this, options);
        },
        showSettings: function(evt) {
            if (jQuery(evt.currentTarget).prop('class').indexOf('inner-settings-expand') == -1) {
                console.log('return false');
                return false;
            }

            var itemId = this.$el.index() - 1;
            var hash = this.controller.currentUrl().split('/');
            var lastHash = hash[hash.length - 1].split('-');

            if (lastHash[0] == this.settings.name) {
                var newArr = hash.slice(0, -1);
                if (jQuery(evt.currentTarget).hasClass('ui-state-active')) {

                    this.controller.navigate(newArr.join('/') + "/" + this.parent.settings.name + "-" + itemId, {
                        trigger: false,
                        replace: true
                    });
                } else {
                    this.controller.navigate(newArr.join('/'), {
                        trigger: false,
                        replace: true
                    });
                }
            } else {
                this.controller.navigate(this.controller.currentUrl() + "/" + this.parent.settings.name + "-" + itemId, {
                    trigger: false,
                    replace: true
                });
            }

            return;
        },
        /**
         * Render filed accordion_item
         * @returns {Object}
         */
        render: function() {
            var items = [],
                htmldata = {
                    "image": this.model.get('image'),
                    "title": this.model.get('title')
                };

            this.tpl = _.template(this.storage.getSkinTemplate('field-accordion-item-expand-preview'));

            this.listenTo(this.model, 'change', function() {
                this.$el.find(".title-item").first().html(this.model.get('title'));
                this.$el.find(".preview-image img").first().prop('src', this.model.get('image'));
            });

            items.push(this.tpl(htmldata));

            this.$el.html(items);
            this.$el.find('.settings-blocks').html(QoobFieldsView.prototype.getHtml.apply(this, arguments));

            return this;
        },
        /**
         * Removes the view from the DOM and unbinds all events.
         * @param {Object} e
         */
        deleteModel: function() {
            this.model.stopListening();
            this.model.trigger('destroy', this.model, this.model.collection);
            this.remove();
            this.model.trigger('remove_item');
        }
    });