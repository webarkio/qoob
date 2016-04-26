/**
 * Create view for toolbar in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderToolbarView = Backbone.View.extend(
        /** @lends BuilderMenuGroupsView.prototype */{
            id: "builder-toolbar",
            tpl: '',
            builder: null,
            /**
             * View toolbar
             * @class BuilderToolbarView
             * @augments Backbone.View
             * @constructs
             */
            initialize: function (builder) {
                var self = this;
                self.builder = builder;
                self.builder.storage.getBuilderTemplate('builder-toolbar', function (err, data) {
                    self.tpl = _.template(data);
                    self.render();
                });
            },
            /**
             * Render toolbar
             * @returns {Object}
             */
            render: function () {
                this.$el.html(this.tpl());
                return this;
            },
            /**
             * Resize toolbar
             */
            resize: function () {
                jQuery('#builder-toolbar').css({width: jQuery(window).width()});
            },
            /**
             * Show toolbar
             */
            show: function () {
                jQuery('#builder-toolbar').show();
            },
            /**
             * Hide toolbar
             */
            hide: function () {
                jQuery('#builder-toolbar').hide();
            },
            /**
             * If visible toolbar
             */
            isVisible: function () {
                return jQuery('#builder-toolbar').is(":visible");
            },
            /**
             * Logo rotation
             * @param {Integer} side
             */
            logoRotation: function (side) {
                // rotate cube logo
                jQuery('#builder-toolbar .logo')
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
                        iframe = this.builder.viewPort.getIframeContents();

                if (jQuery(elem).hasClass('active')) {
                    jQuery('#builder-toolbar').fadeIn(300);
                    jQuery('#builder-menu').fadeIn(300);
                    iframe.find('.control-block-button').fadeIn(300);

                    jQuery('#builder-toolbar').find('.hide-builder').removeClass('active');
                    jQuery(elem).remove();

                    this.builder.viewPort.resize();
                    this.builder.viewPort.resizeIframe();
                } else {
                    jQuery(elem).addClass('active');
                    jQuery('#builder-toolbar').fadeOut(300, function () {
                        self.builder.viewPort.resize();
                        self.builder.viewPort.resizeIframe();
                        var width = (jQuery('#builder-iframe').width() - jQuery('#builder-iframe').contents().width());

                        jQuery('#builder').prepend('<button class="arrow-btn hide-builder active" type="button" onclick="parent.builder.toolbar.hideBuilder(this); return false;" style="display:none; right: ' + width + 'px"></button>');
                        jQuery('#builder>.hide-builder').fadeIn(300);
                    });
                    jQuery('#builder-menu').fadeOut(300);
                    iframe.find('.control-block-button').fadeOut(300);
                }

            }
        });