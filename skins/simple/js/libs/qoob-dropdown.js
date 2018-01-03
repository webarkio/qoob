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
};
(function($) {
    $(document).on('click', '.qoob-dropdown-toggle', function(evt) {
        // evt.stopImmediatePropagation();

        var $parent = $(this).parent('.qoob-dropdown'),
            $dropdown = $parent.find('.qoob-dropdown-content');

        $('.qoob-dropdown').each(function(index, el) {
            $(el).find('.qoob-dropdown-content').trigger('hide');
        });

        // Listen to show and hide event
        $dropdown.on({
            'show': function() {
                $parent.addClass('active');

                $(this).slideDown({
                        queue: false,
                        duration: 300,
                        easing: 'easeOutCubic'
                    })
                    .animate({ opacity: 1 }, { queue: false, duration: 300, easing: 'easeOutSine' });

                evt.stopImmediatePropagation();
            },
            'hide': function() {
                $(this).fadeOut(225);
                $parent.removeClass('active');
                $dropdown.off('click show hide');
            },
            'click': function(evt) {
                if(evt.target.tagName.toLowerCase() === 'a') {
                    $(this).trigger('hide');
                }
            }
        });

        if (!$dropdown.is(':visible')) {
            $dropdown.trigger('show');
        } else {
            $dropdown.trigger('hide');
        }

        // close select drop down
        $(window).one({
            'click': function(evt) {
                if ($(evt.target).parents('.qoob-dropdown-content').length == 0) {
                    $dropdown.trigger('hide');
                }
            },
            'blur': function() {
                $dropdown.trigger('hide');
            }
        });
    });
}(jQuery));