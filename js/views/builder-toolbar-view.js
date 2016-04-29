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
            },
            /**
             * Button hide all builder
             */
            hideBuilder: function (elem) {
                var self = this,
                        iframe = builder.builderLayout.viewPort.getIframeContents();

                if (jQuery(elem).hasClass('active')) {
                    this.$el.fadeIn(300);
                    jQuery('#builder-menu').fadeIn(300);
                    iframe.find('.control-block-button').fadeIn(300);

                    this.$el.find('.hide-builder').removeClass('active');
                    jQuery(elem).remove();

                    builder.builderLayout.viewPort.resize();
                    builder.builderLayout.viewPort.resizeIframe();
                } else {
                    jQuery(elem).addClass('active');
                    this.$el.fadeOut(300, function () {
                        builder.builderLayout.viewPort.resize();
                        builder.builderLayout.viewPort.resizeIframe();
                        var width = (jQuery('#builder-iframe').width() - jQuery('#builder-iframe').contents().width());

                        jQuery('#builder').prepend('<button class="arrow-btn hide-builder active" type="button" onclick="parent.builder.builderLayout.toolbar.hideBuilder(this); return false;" style="display:none; right: ' + width + 'px"></button>');
                        jQuery('#builder>.hide-builder').fadeIn(300);
                    });
                    jQuery('#builder-menu').fadeOut(300);
                    iframe.find('.control-block-button').fadeOut(300);
                }

            }
        });