/**
 * Main script for wp-admin 
 * @param {window.jQuery} $
 */
(function ($) {
    $(document).ready(function () {
        // Add button editor in WP admin
        var url = '/wp-admin/post.php?qoob=true&post_id=' + jQuery('#post_ID').val() + '&post_type=page';
        var button = '<div class="cube-button-block"><div class="cube-button"><a class="cube-btn" href="' + url + '"><i class="cube"></i><span></span></a></div></div>';
        $(button).insertAfter('div#titlediv');

        Waves.init();
        Waves.attach('.cube-btn', ['waves-button']);
    });
})(window.jQuery);