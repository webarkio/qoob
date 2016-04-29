/**
 * Create view for toolbar in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderToolbarView = Backbone.View.extend(
        /** @lends BuilderMenuGroupsView.prototype */{
            tagName: 'div',
            tpl: '',
            builder: null,
            attributes: function () {
                return {
                    id: "builder-toolbar"
                };
            },
            /**
             * View toolbar
             * @class BuilderToolbarView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (pageModel) {
                this.pageModel = pageModel;
                builder.on('set_preview_mode', this.onPreviewMode.bind(this));
                builder.on('set_edit_mode', this.onEditMode.bind(this));
            },
            /**
             * Render toolbar
             * @returns {Object}
             */
            render: function () {
                var data = builder.storage.builderTemplates['builder-toolbar'];
                this.tpl = _.template(data);
                this.$el.html(this.tpl());
                return this;
            },
            onPreviewMode: function () {
                this.$el.find('.hide-builder').addClass('active');
                this.$el.fadeOut(300);
            },
            onEditMode: function () {
                this.$el.find('.hide-builder').removeClass('active');
                this.$el.fadeIn(300);
            },
            /**
             * Resize toolbar
             */
            resize: function () {
                this.$el.css({width: jQuery(window).width()});
            },
            /**
             * Show toolbar
             */
            show: function () {
                this.$el.show();
            },
            /**
             * Hide toolbar
             */
            hide: function () {
                this.$el.hide();
            },
            /**
             * If visible toolbar
             */
            isVisible: function () {
                return this.$el.is(":visible");
            },
            /**
             * Logo rotation
             * @param {Integer} side
             */
            logoRotation: function (side) {
                // rotate cube logo
                this.$el.find('.logo')
                        .removeClass(function (index, css) {
                            return (css.match(/\bside-\S+/g) || []).join(' ');
                        })
                        .addClass(side);
            },
            /**
             * Buttons screen size
             */
            screenSize: function (elem) {
                jQuery('.screen-size').removeClass('active');
                jQuery(elem).addClass('active');

                var classes = jQuery(elem).attr('class').split(' '),
                        current = classes[1],
                        size = {};

                switch (current) {
                    case 'pc':
                        size = {'width': '100%'};
                        break;
                    case 'tablet-vertical':
                        size = {'width': '768px'};
                        break;
                    case 'phone-vertical':
                        size = {'width': '375px'};
                        break;
                    case 'tablet-horizontal':
                        size = {'width': '1024px'};
                        break;
                    case 'phone-horizontal':
                        size = {'width': '667px'};
                        break;
                }

                jQuery('#builder-viewport iframe').stop().animate({
                    width: size.width
                });

                var class_remove = jQuery('#builder-viewport').attr('class');
                jQuery('#builder-viewport').removeClass(class_remove).addClass(current);
            }
        });