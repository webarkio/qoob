var ControllsScroll = {
    options: {
        activeCount: 0,
        activeBlock: null,
    },
    
    init: function () {
        var self = this;

        jQuery('#builder-blocks .content-block').appear();
        this.enableEvents();
    },
    
    enableEvents: function () {
        var self = this;
        
        jQuery(document.body).on('appear', '.content-block', function () {
            if (self.options.activeCount === 0 && (!self.options.activeBlock || self.options.activeBlock !== jQuery(this).attr('data-model-id'))) {
                if (!jQuery('.active-scrolling').offset() || (jQuery('.active-scrolling').offset().top + jQuery('.active-scrolling').height() - jQuery(document).scrollTop()) > 190) {
                    jQuery(this).addClass('active-scrolling');
                    self.options.activeCount++;
                }
            }
        });

        jQuery(document.body).on('disappear', '.content-block', function () {
            if (jQuery(this).hasClass('active-scrolling')) {
                jQuery(this).removeClass('active-scrolling');
                self.options.activeCount--;
            }
        });

        jQuery(document).on('scroll.controll_scroll', function () {
            var scrollingBlock = jQuery('#builder-blocks .active-scrolling');

            if (scrollingBlock && scrollingBlock.offset()) {
                var overcomeTop = scrollingBlock.find('.control-block-button').offset().top < (scrollingBlock.offset().top - 44),
                        overcomeBottom = (scrollingBlock.offset().top
                                + scrollingBlock.height() - scrollingBlock.find('.control-block-button').offset().top) < 50;

                if (overcomeTop || overcomeBottom) {
                    self.options.activeBlock = jQuery('.active-scrolling').attr('data-model-id');
                    scrollingBlock.removeClass('active-scrolling');
                    self.options.activeCount--;
                }
            }
        });
    },
    
    disableEvents: function() {
      jQuery(document.body).off('appear', '.content-block');
      jQuery(document.body).off('disappear', '.content-block');
      jQuery(document).off('scroll.controll_scroll');
    },
    
    setDefault: function () {
        this.options.activeCount = 0;
        this.options.activeBlock = null;
        jQuery('#builder-blocks .active-scrolling').removeClass('active-scrolling');
    }
}

//Inititng scroling of controll buttons
ControllsScroll.init();



