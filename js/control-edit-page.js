/**
 * Control edit draft page and builder
 * 
 * @param {window.jQuery} $
 */
(function ($) {
    $('html').removeClass('wp-toolbar');
    $('#wpadminbar').hide();

    $(document).ready(function () {
        $('body').removeClass('admin-bar').addClass('builder-editor');

        $('#wpadminbar').hide();
        $('.edit-link').hide();
        $('#screen-meta-links, #screen-meta').hide();

        // Autosave checkbox
        $(".checkbox-sb input[type='checkbox']").click(function () {
            builder.autosavePageData();
        });

        // Button Save
        $('.edit-control-button .save').click(function () {
                builder.save();
        });
        
        $('.exit-modal').click(function(){
            $('.modal-save-block').toggle();
        });

        // Button screen size
        $('.screen-size').click(function (e) {
            e.preventDefault();

            $('.screen-size').removeClass('active');
            $(this).addClass('active');

            var classes = $(this).attr('class').split(' '),
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

            $('#builder-viewport iframe').stop().animate({
                width: size.width
            });

            var class_remove = $('#builder-viewport').attr('class');
            $('#builder-viewport').removeClass(class_remove).addClass(current);
        });

        // Button hide all builder
        $(document).on('click', '.hide-builder', function (e) {
            e.preventDefault();
            
            var iframe = jQuery('#builder-iframe').contents();
            
            if ($(this).hasClass('active')) {
                $('#builder-toolbar').fadeIn(300);
                $('#builder-menu').fadeIn(300);
                iframe.find('.control-block-button').fadeIn(300);
                
                $('#builder-toolbar').find('.hide-builder').removeClass('active');
                $(this).remove();

                builder.viewPort.resize();
                builder.iframe.resize();
            } else {
                $(this).addClass('active');
                $('#builder-toolbar').fadeOut(300, function () {
                    builder.viewPort.resize();
                    builder.iframe.resize();
                    var swidth = ($('#builder-iframe').width() - $('#builder-iframe').contents().width());
                    $('#builder').prepend('<button class="arrow-btn hide-builder active" type="button" style="display:none; right: ' + swidth + 'px"></button>');
                    $('#builder>.hide-builder').fadeIn(300);
                });
                $('#builder-menu').fadeOut(300);
                iframe.find('.control-block-button').fadeOut(300);
            }
        });
    });
})(window.jQuery);