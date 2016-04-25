/**
 * Initialize builder menu
 *  
 * @version 0.0.1
 * @class  BuilderMenu
 * @param {Object} builder
 */
function BuilderMenu(builder) {
    this.builder = builder;
    this.currentSide = 'side-0';
    this.backSide = null;
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
    this.addView(menuGroupsView, 0);
};
/**
 * Create blocks menu
 */
BuilderMenu.prototype.createBlocks = function () {
    var blocksPreviewView = new BuilderMenuBlocksPreviewView();
    this.addView(blocksPreviewView, 90);
};


/**
 * Switching to inner field's settings 
 * @param {number} blockId
 * @param {string} markup
 */
BuilderMenu.prototype.showInnerSettings = function (parentId, markup) {


    if (parentId === 'inner-settings-accordion') {
        jQuery("#inner-settings-accordion").hide();
    } else {
        this.hideAll();
    }

    jQuery('.blocks-settings').append(markup);
};

/**
 * Resize menu
 */
BuilderMenu.prototype.resize = function () {
    jQuery('#builder-menu').css({
        height: jQuery(window).height() - 70,
        top: 70
    });
};

/**
 * Menu rotation
 * @param {Integer} id
 * @param {Boolean} back Rotate back
 */
BuilderMenu.prototype.rotate = function (id, back) {
    // if rotate back
    back = typeof back !== 'undefined' ? back : false;

    // current block for id
    var element = jQuery('#' + id);

    // get block side
    var side = element.parent().closest('div[id]');
    var sideId = element.parent().closest('div[id]').prop('id');

    // Set back side
    this.backSide = this.currentSide;

    // Set current side
    this.currentSide = sideId;

    // hide all blocks side
    side.find('.menu-block').hide();

    // show current block menu
    element.show();

    // rotate cube menu
    jQuery('#builder-menu .card-main')
            .removeClass(function (index, css) {
                return (css.match(/\bside-\S+/g) || []).join(' ');
            })
            .addClass(this.currentSide);

    this.builder.toolbar.logoRotation(this.currentSide);
};

/**
 * Rotate menu back
 */
BuilderMenu.prototype.back = function () {
    var tmp = this.backSide;

    // rotate cube menu
    jQuery('#builder-menu .card-main')
            .removeClass(function (index, css) {
                return (css.match(/\bside-\S+/g) || []).join(' ');
            })
            .addClass(this.backSide);

    // Set back side
    this.backSide = this.currentSide;

    // Set current side
    this.currentSide = tmp;
};

/**
 * Add view to side cube
 * @param {Object} BackboneView  View from render
 * @param {String} side Side cube
 */
BuilderMenu.prototype.addView = function (BackboneView, side) {
    jQuery('#side-' + side).append(BackboneView.el);
};