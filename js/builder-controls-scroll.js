(function ($) {
    var activeCount = 0,
        activeBlock;

    $('#builder-blocks .content-block').appear();

    $(document.body).on('appear', '.content-block', function () {
        if (activeCount === 0 && (!activeBlock || activeBlock !== $(this).attr('data-model-id'))) {
            if (!$('.active-scrolling').offset() || ($('.active-scrolling').offset().top + $('.active-scrolling').height() - $(document).scrollTop()) > 190) {
                $(this).addClass('active-scrolling');
                activeCount++;
            }
        }
    });

    $(document.body).on('disappear', '.content-block', function () {
        if ($(this).hasClass('active-scrolling')) {
            $(this).removeClass('active-scrolling');
            activeCount--;
        }
    });

    $(document).on('scroll', function () {
        var scrollingBlock = $('#builder-blocks .active-scrolling');

        if (scrollingBlock && scrollingBlock.offset()) {
            var overcomeTop = scrollingBlock.find('.control-block-button').offset().top < (scrollingBlock.offset().top - 44),
                    overcomeBottom = (scrollingBlock.offset().top
                            + scrollingBlock.height() - scrollingBlock.find('.control-block-button').offset().top) < 50;

            if (overcomeTop || overcomeBottom) {
                activeBlock = $('.active-scrolling').attr('data-model-id');
                scrollingBlock.removeClass('active-scrolling');
                activeCount--;
            }
        }
    });
    
})(jQuery);


