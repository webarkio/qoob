/**
 * Create view for toolbar in builder layout
 *
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderToolbarView = Backbone.View.extend(
    /** @lends BuilderMenuGroupsView.prototype */
    {
        tagName: 'div',
        attributes: function() {
            return {
                id: "builder-toolbar"
            };
        },
        events: {
            'click .preview-mode-button': 'clickPreviewMode',
            'click .screen-mode-button': 'clickScreenMode'
        },
        /**
         * View toolbar
         * @class BuilderToolbarView
         * @augments Backbone.View
         * @constructs
         */
        initialize: function(options) {
            this.storage = options.storage;
            this.controller = options.controller;
        },
        /**
         * Render toolbar
         * @returns {Object}
         */
        render: function() {
            this.$el.html(_.template(this.storage.builderTemplates['builder-toolbar'])());
            return this;
        },
        setPreviewMode: function() {
            this.$el.fadeOut(300);
        },
        setEditMode: function() {
            this.$el.fadeIn(300);
        },
        /**
         * Resize toolbar
         */
        resize: function() {
            this.$el.css({
                width: jQuery(window).width()
            });
        },
        //EVENTS
        clickPreviewMode: function() {
            this.controller.setPreviewMode();
        },
        clickScreenMode: function(evt){
            this.controller.setScreenMode(evt.target.name);
        },

        /**
         * Logo rotation
         * @param {Integer} side
         */
        logoRotation: function(side) {
            // rotate cube logo
            this.$el.find('.logo')
                .removeClass(function(index, css) {
                    return (css.match(/\bside-\S+/g) || []).join(' ');
                })
                .addClass(side);
        },
        /**
         * Buttons screen size
         */
        screenSize: function(elem) {
            jQuery('.screen-size').removeClass('active');
            jQuery(elem).addClass('active');

            var classes = jQuery(elem).attr('class').split(' '),
                current = classes[1],
                size = {};

            switch (current) {
                case 'pc':
                    size = {
                        'width': '100%'
                    };
                    break;
                case 'tablet-vertical':
                    size = {
                        'width': '768px'
                    };
                    break;
                case 'phone-vertical':
                    size = {
                        'width': '375px'
                    };
                    break;
                case 'tablet-horizontal':
                    size = {
                        'width': '1024px'
                    };
                    break;
                case 'phone-horizontal':
                    size = {
                        'width': '667px'
                    };
                    break;
            }

            jQuery('#builder-viewport iframe').stop().animate({
                width: size.width
            });

            var class_remove = jQuery('#builder-viewport').attr('class');
            jQuery('#builder-viewport').removeClass(class_remove).addClass(current);
        }
    });
