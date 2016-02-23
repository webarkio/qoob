;
(function ($) {
    $('body').append('<div id="loader-wrapper">\
                            <div id="loader">\
                                <div class="minutes-container"><div class="minutes"></div></div>\
                                <div class="seconds-container"><div class="seconds"></div></div>\
                            </div>\
                        </div>');
    $(window).on('load', function () {
        $('#loader-wrapper').fadeOut();
        setTimeout(function() {
            $('#loader-wrapper').remove();
        }, 1000);
    });
})(jQuery);


