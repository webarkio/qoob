/**
 * Initialize builder menu
 *  
 * @version 0.0.1
 * @class  BuilderMenu
 * @param {Object} builder
 */
function BuilderMenu(builder) {
    this.builder = builder;
//    this.rotate = false;
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
    var menuGroupsView = new BuilderMenuGroupsView();
    jQuery('#builder-menu .groups').prepend(menuGroupsView.el);
};
/**
 * Create blocks menu
 */
BuilderMenu.prototype.createBlocks = function () {
    var blocksPreviewView = new BuilderMenuBlocksPreviewView();
    jQuery('#builder-menu .list-group').append(blocksPreviewView.el);
};
/**
 * Show groups menu
 */
BuilderMenu.prototype.showGroups = function () {
//    jQuery('#catalog-groups').show();

    // default position block settings
//    this.rotate = false;

    // rotate menu
//    this.rotate(90);

    // rotate logo
    this.builder.toolbar.logoRotation(-90);

    // add Scrollbar
    setTimeout(function () {
        jQuery('.settings.menu-block').hide();
    }, 1000);
};
/**
 * Show blocks by group id
 * @param {Integer} groupId
 */
BuilderMenu.prototype.showBlocks = function (groupId) {
    // rotate menu
//    this.rotate(180);

    // rotate logo
    this.builder.toolbar.logoRotation(-180);

    this.hideAll();
    jQuery('#group-' + groupId).show();
};
/**
 * Show settings by block id
 * @param {Integer} blockId
 */
BuilderMenu.prototype.showSettings = function (blockId) {

    if (blockId === "inner-settings-accordion") {
        jQuery('.settings.menu-block').hide();
        jQuery('#inner-settings-image').remove();
        // logo rotation
        this.builder.toolbar.logoRotation(-360);
        // menu rotation
//        this.rotate(360);
        jQuery('#inner-settings-accordion').show();

        return;
    }

    if (jQuery('#settings-block-' + blockId).is(":not(':hidden')"))
        return;
//
//    if (this.rotate == true) {
//        // logo rotation
//        this.builder.toolbar.logoRotation(-360);
//        // menu rotation
//        this.rotate(360);
//        // state rotate
//        this.rotate = false;
//    } else {
//        // logo rotation
//        this.builder.toolbar.logoRotation(0);
//        // menu rotation
//        this.rotate(0);
//        // state rotate
//        this.rotate = true;
//    }

    jQuery('.settings.menu-block').hide();
    jQuery('.inner-settings').remove();
    jQuery('#settings-block-' + blockId).show();
};
/**
 * Switching to inner field's settings 
 * @param {number} blockId
 * @param {string} markup
 */
BuilderMenu.prototype.showInnerSettings = function (parentId, markup) {
    // logo rotation
    this.builder.toolbar.logoRotation(-360);
    // menu rotation
//    this.rotate(360);
//    // state rotate
//    this.rotate = false;

    if (parentId === 'inner-settings-accordion') {
        jQuery("#inner-settings-accordion").hide();
//        this.rotate(-360);
    } else {
        this.hideAll();
    }
    // jQuery('#settings-block-' + blockId).hide();

    jQuery('.blocks-settings').append(markup);
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
 * @param {Integer} id
 * @param {Boolean} back
 */

BuilderMenu.prototype.rotate = function (id, back) {
    // if return back
    back = typeof back !== 'undefined' ? back : false;

    // current block for id
    var element = jQuery('#' + id);
   
    // block side
    var side = element.parent().prop('id');
    
    console.log(element.parent('[id]'));

    // hide all blocks
    jQuery('.menu-block').hide();

    // show current block menu
    element.show();

    // rotate cube menu
    jQuery('#builder-menu .card-main')
            .removeClass(function (index, css) {
                return (css.match(/\side-\S+/g) || []).join(' ');
            })
            .addClass(side);

//    jQuery('#builder-menu .card-main').css("transform", "rotateY(" + rot + "deg)");
};