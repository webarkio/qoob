"use strict";

// Check for jQuery.
if (typeof(jQuery) === 'undefined') {
    var jQuery;
    // Check if require is a defined function.
    if (typeof(require) === 'function') {
        jQuery = $ = require('jquery');
        // Else use the dollar sign alias.
    } else {
        jQuery = $;
    }
}

;
(function($) {
    $(document).on('click', '.qoob-dropdown-toggle', function(event) {
        event.preventDefault();

        var $parent = $(this).parent(),
            $dropdown = $($parent).find('.qoob-dropdown-content');

        if (!$dropdown.is(':visible')) {

            $dropdown.slideDown({
                    queue: false,
                    duration: 300,
                    easing: 'easeOutCubic'
                })
                .animate({ opacity: 1 }, { queue: false, duration: 300, easing: 'easeOutSine' });
        } else {
            $dropdown.fadeOut(225);
        }
    });
}(jQuery));


// < div class = "dropdown" >
//     < button class = "btn btn-primary dropdown-toggle"
// type = "button"
// data - toggle = "dropdown" > Dropdown Example < span class = "caret" > < /span></button >
//     < ul class = "dropdown-menu" >
//     < li > < a href = "#" > HTML < /a></li >
//     < li > < a href = "#" > CSS < /a></li >
//     < li > < a href = "#" > JavaScript < /a></li >
//     < /ul> < /div>
