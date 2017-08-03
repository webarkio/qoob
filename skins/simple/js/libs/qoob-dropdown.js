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
        event.stopPropagation();

        var $parent = $(this).parent('.qoob-dropdown'),
            $dropdown = $parent.find('.qoob-dropdown-content');

        // Listen to show and hide event
        $dropdown.on({
            'show': function() {

                $(this).slideDown({
                        queue: false,
                        duration: 300,
                        easing: 'easeOutCubic'
                    })
                    .css('overflow', 'visible', 'important')
                    .animate({ opacity: 1 }, { queue: false, duration: 300, easing: 'easeOutSine' });

                $parent.addClass('active');
            },
            'hide': function() {
                $(this).fadeOut(225);
                $parent.removeClass('active');
            }
        });

        $dropdown.on('click', 'a', function(event) {
            $dropdown.trigger('hide');
        });

        if (!$dropdown.is(':visible')) {
            $dropdown.trigger('show');
        } else {
            $dropdown.trigger('hide');

        }

        $parent.mouseleave(function() {
            $dropdown.trigger('hide');
        });
    });

}(jQuery));
