/**
 * Initialize builder menu
 *  
 * @version 0.0.1
 * @class  BuilderMenu
 */
function BuilderMenu(builder) {
    this.builder = builder;
    this.rotate = false;
}

/**
 * Create menu (blocks, settings)
 */
BuilderMenu.prototype.create = function () {
    this.createGroups();
    this.createBlocks();
    this.showGroups();
};
/**
 * Create groups blocks
 */
BuilderMenu.prototype.createGroups = function () {
    var groups_arr = _.sortBy(this.builder.builderData.groups, 'position');
    var res = '<ul id="catalog-groups" class="catalog-list">';
    for (var i = 0; i < groups_arr.length; i++) {
        var group = groups_arr[i];
        var group_id = group.id.replace(/\s+/g, '').toLowerCase();
        res = res + '<li><a href="#' + group_id + '" onclick="builder.menu.showBlocks(\'' + group_id + '\');return false;">' + (group.label ? group.label : group.id) + '</a></li>';
    }
    res = res + '</ul>';
    jQuery('#builder-menu .groups').append(res);
};
/**
 * Create blocks menu
 */
BuilderMenu.prototype.createBlocks = function () {
    var res = '';
    for (var i = 0; i < this.builder.builderData.groups.length; i++) {
        var group = this.builder.builderData.groups[i];
        var group_id = group.id.replace(/\s+/g, '').toLowerCase();
        res = res + '<div class="catalog-templates menu-block" id="group-' + group_id + '">';
        res = res + '<div class="backward"><a href="#" onclick="builder.menu.showGroups();return false;">' + (group.label ? group.label : group.id) + '</a></div>';
        res = res + '<div class="preview-blocks">';
//        for (var j = 0; j < group.templates.length; j++) {
        for (var k = 0; k < this.builder.builderData.templates.length; k++) {
            if (this.builder.builderData.templates[k].groups == group.id) {
                res = res + '<div id="preview-block-' + this.builder.builderData.templates[k].id + '" class="preview-block"><img src="' + this.builder.builderData.templates[k].url + 'preview.png"></div>';
            }
        }
//        }
        res = res + '</div></div>';
    }
    jQuery('#builder-menu .list-group').append(res);
    jQuery('.preview-block').draggable({
        appendTo: "body",
        helper: "clone",
        iframeFix: true,
        iframeScroll: true,
        scrollSensitivity: 50,
        scrollSpeed: 10,
        start: function (event, ui) {
            jQuery('.droppable').show();
        },
        stop: function (event, ui) {
            jQuery('.droppable').hide();
            // Remove empty div for mobile
            if (jQuery('#builder-viewport').find('div').length > 0) {
                jQuery('#builder-viewport').find('div').remove();
            }
        }
    });
};
/**
 * Show groups menu
 */
BuilderMenu.prototype.showGroups = function () {
    jQuery('#catalog-groups').show();
    
    // default position block settings
    this.rotate = false;

    // rotate menu
    this.menuRotation(0);

    // rotate logo
    this.builder.toolbar.logoRotation(0);

    // add Scrollbar
    var catalogGroups = jQuery('#catalog-groups');
    catalogGroups.perfectScrollbar();

    setTimeout(function () {
        jQuery('.settings.menu-block').hide();
    }, 1000);

    jQuery(window).resize(function () {
        catalogGroups.perfectScrollbar('update');
    });
};
/**
 * Show blocks by group id
 * @param {Integer} groupId
 */
BuilderMenu.prototype.showBlocks = function (groupId) {
    // rotate menu
    this.menuRotation(-90);
    // rotate logo
    this.builder.toolbar.logoRotation(90);

    this.hideAll();
    jQuery('#group-' + groupId).show();

    // add Scrollbar
    var previewBlocks = jQuery('#group-' + groupId).find('.preview-blocks');
    previewBlocks.perfectScrollbar();
    jQuery(window).resize(function () {
        previewBlocks.perfectScrollbar('update');
    });

};
/**
 * Show settings by block id
 * @param {Integer} blockId
 */
BuilderMenu.prototype.showSettings = function (blockId) {
    
    if (jQuery('#settings-block-' + blockId).is(":not(':hidden')"))
        return;
    
    if (this.rotate == true) {
        // logo rotation
        this.builder.toolbar.logoRotation(-450);
        // menu rotation
        this.menuRotation(450);
        // state rotate
        this.rotate = false;
    } else {
        // logo rotation
        this.builder.toolbar.logoRotation(-90);
        // menu rotation
        this.menuRotation(90);
        // state rotate
        this.rotate = true;
    }

    jQuery('.settings.menu-block').hide();
    jQuery('#settings-block-' + blockId).show();

    // add Scrollbar
    var settingsScroll = jQuery('#settings-block-' + blockId).find('.settings-scroll');
    settingsScroll.perfectScrollbar();
    jQuery(window).resize(function () {
        settingsScroll.perfectScrollbar('update');
    });
};
/**
 * Hide group by id
 * @param {Integer} groupId
 */
BuilderMenu.prototype.hideAll = function (groupId) {
    jQuery('.menu-block').hide();
};
/**
 * Resize menu
 */
BuilderMenu.prototype.resize = function () {
    jQuery('#builder-menu').css({
        height: jQuery(window).height() - 70,
        top: 70
    });
//    jQuery('.settings-block, .preview-blocks').css({
//        height: jQuery(window).height() - 140
//    });
};

/**
 * Menu rotation
 * @param {Integer} rot
 */
BuilderMenu.prototype.menuRotation = function (rot) {
    jQuery('#builder-menu .card-main').css("transform", "rotateY(" + rot + "deg)");
};