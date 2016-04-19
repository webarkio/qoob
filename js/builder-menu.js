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
    var menuGroupsView = new BuilderMenuGroupsView();
    var data = {
        "groups_arr" : _.sortBy(this.builder.storage.builderData.groups, 'position')
    }

    menuGroupsView.render(data);
};
/**
 * Create blocks menu
 */
BuilderMenu.prototype.createBlocks = function () {
    var blocksPreviewView = new BuilderMenuBlocksPreviewView();
    var data = {
        "groups" : this.builder.storage.builderData.groups,
        "items" : this.builder.storage.builderData.items
    }
    blocksPreviewView.render(data);
};
/**
 * Show groups menu
 */
BuilderMenu.prototype.showGroups = function () {
//    jQuery('#catalog-groups').show();

    // default position block settings
    this.rotate = false;

    // rotate menu
    this.menuRotation(90);

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
    this.menuRotation(180);
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

    if(blockId === "inner-settings-accordion") {
        jQuery('.settings.menu-block').hide();
        jQuery('#inner-settings-image').remove();
        // logo rotation
        this.builder.toolbar.logoRotation(-360);
        // menu rotation
        this.menuRotation(360);
        jQuery('#inner-settings-accordion').show();

        return;
    }

    if (jQuery('#settings-block-' + blockId).is(":not(':hidden')"))
        return;

    if (this.rotate == true) {
        // logo rotation
        this.builder.toolbar.logoRotation(-360);
        // menu rotation
        this.menuRotation(360);
        // state rotate
        this.rotate = false;
    } else {
        // logo rotation
        this.builder.toolbar.logoRotation(0);
        // menu rotation
        this.menuRotation(0);
        // state rotate
        this.rotate = true;
    }
    
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
    this.menuRotation(360);
    // state rotate
    this.rotate = false;

    if(parentId === 'inner-settings-accordion'){
        jQuery("#inner-settings-accordion").hide();
        this.menuRotation(-360);
    }else {
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
 * @param {Integer} rot
 */
BuilderMenu.prototype.menuRotation = function (rot) {
    jQuery('#builder-menu .card-main').css("transform", "rotateY(" + rot + "deg)");
};