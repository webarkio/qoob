/**
 * Control iframe page
 * 
 * @param {window.jQuery} $
 */
(function ($) {
    $('html').removeClass('no-js').addClass('active-js');
    $('body').removeClass('admin-bar');

    $(document).ready(function () {
        $('#wpadminbar').hide();
        
        // menu stop click
        $('.navbar .menu-item a').click(function(e){
            e.preventDefault();
        });

        // Add general block
        if ($('body').find('.builder-sc').length > 0) {
            var first_sc = $('body').find('.builder-sc').first().parent();
            first_sc.append('<div id="builder-blocks"></div>');
            $('body').find('.builder-sc').remove();
        }
    });
})(window.jQuery);