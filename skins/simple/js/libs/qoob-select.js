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
        $(this).each(function() {
            var optionsHover = false,
                $select = $(this),
                children = $select.children('option'),
                selectedOptionText,
                selectedOptionValue = $select.find('option:selected').val() || $select.find('option:first').val();

            if ($select.find('option:selected').data('icon') !== undefined) {
                selectedOptionText = '<i class="' + $select.find('option:selected').data('icon') + '"></i>';
            } else {
                selectedOptionText = $select.find('option:selected').html() || $select.find('option:first').html() || "";
                selectedOptionText = selectedOptionText.replace(/"/g, '&quot;');
            }
            
            var $options = $('<ul class="qoob-select-dropdown"></ul>');

            $select.wrap('<div class="qoob-select"></div>');

            /* Create dropdown structure. */
            if (children.length) {
                children.each(function() {
                    if ($(this).data('title') !== undefined) {
                        $options.append($('<li data-value="' + $(this).val() + '" data-title="' + $(this).data('title') + '"><span>' + $(this).html() + '</span></li>'));
                    } else if ($(this).data('icon') !== undefined) {
                        $options.append($('<li data-value="' + $(this).val() + '"><i class="' + $(this).data('icon') + '"></i></li>'));
                    } else {
                        $options.append($('<li data-value="' + $(this).val() + '"><span>' + $(this).html() + '</span></li>'));
                    }
                });
            }

            var $selectedValue = $('<div />', {
                'class': 'qoob-selected-value',
                'data-value': selectedOptionValue,
                'tabindex': 0
            }).append(selectedOptionText);

            $select.before($selectedValue);
            $selectedValue.after($options);

            $options.find('li').each(function(i) {
                $(this).click(function(e) {
                    // Check if option element is disabled
                    if (!$(this).hasClass('disabled')) {
                        $options.find('li').removeClass('active');
                        $(this).toggleClass('active');

                        var title = $(this).data('title') || $(this).html();
                        $selectedValue.html(title);
                        $select.find('option').eq(i).prop('selected', true);

                        selectedOptionValue = $(this).data('value');

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

                    var selectedOption = $options.find('li').filter(function() {
                        return $(this).data('value').toLowerCase() === selectedOptionValue.toLowerCase();
                    });

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
        });
    }
}(jQuery));