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
    $.fn.qoobSelect = function() {
        var optionsHover = false,
            $select = $(this),
            children = $select.children('option'),
            val = $select.find('option:selected').html() || $select.find('option:first').html() || "";

        var $options = $('<ul class="qoob-select-dropdown"></ul>');

        $select.wrap('<div class="qoob-select"></div>');

        /* Create dropdown structure. */
        if (children.length) {
            children.each(function() {
                var disabledClass = ($(this).is(':disabled')) ? 'disabled ' : '';
                $options.append($('<li class="' + disabledClass + '"><span>' + $(this).html() + '</span></li>'));
            });
        }

        var $selectedValue = $('<div />', {
            'class': 'qoob-selected-value',
            'tabindex': 0
        }).append(val.replace(/"/g, '&quot;'));

        $select.before($selectedValue);
        $selectedValue.after($options);

        $options.find('li').each(function() {
            $(this).click(function(e) {
                // Check if option element is disabled
                if (!$(this).hasClass('disabled')) {
                    $options.find('li').removeClass('active');
                    $(this).toggleClass('active');
                    $selectedValue.html($(this).text());

                    $options.trigger('close');

                    // Trigger change input event
                    $select.trigger('change');
                }

                e.stopPropagation();
            });
        });

        $selectedValue.on('click', function(e) {
            if ($options.hasClass('active')) {
                $options.trigger('close');
                return;
            }

            if (!$options.is(':visible')) {
                $options.trigger('open');
                var label = $(this).html();

                var selectedOption = $options.find('li').filter(function() {
                    return $(this).text().toLowerCase() === label.toLowerCase();
                })[0];

                $(selectedOption).addClass('selected');
                $(selectedOption).prependTo($options);
            }

            e.stopPropagation();
        });

        // Listen to open and close event
        $options.on({
            'open': function() {
                $(this).addClass('active');
                $(this).slideDown({
                        queue: false,
                        duration: 300,
                        easing: 'easeOutCubic'
                    })
                    .animate({ opacity: 1 }, { queue: false, duration: 300, easing: 'easeOutSine' });
            },
            'close': function() {
                $(this).removeClass('active');
                $options.find('.selected').removeClass('selected');
                $(this).fadeOut(225);
            }
        });

        $selectedValue.on('blur', function() {
            console.log('blur');
            $options.trigger('close');
        });

        $options.hover(function() {
            optionsHover = true;
        }, function() {
            optionsHover = false;
        });

        // close select drop down
        $(window).on({
            'click': function() {
                optionsHover || $options.trigger('close');
            }
        });
    }
}(jQuery));
