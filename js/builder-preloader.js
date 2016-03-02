jQuery(document).ready(function () {
    jQuery('body').append('<div id="loader-wrapper">\
                            <div id="loader">\
                                <div class="minutes-container"><div class="minutes"></div></div>\
                                <div class="seconds-container"><div class="seconds"></div></div>\
                            </div>\
                        </div>');
    jQuery(window).on('load', function () {
        jQuery('#loader-wrapper').fadeOut();
        setTimeout(function () {
            jQuery('#loader-wrapper').remove();
        }, 1000);
    });
});




