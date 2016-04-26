/**
 * Create view for menu in builder layout
 * 
 * @type @exp;Backbone@pro;View@call;extend
 */
var BuilderMenuView = Backbone.View.extend({
    id: "builder-menu",
    tpl: '',
    builder: null,
    rotate: false,
    currentSide: 'side-0',
    backSide: null,
    /**
     * View menu
     * @class BuilderMenuView
     * @augments Backbone.View
     * @constructs
     */
    initialize: function (builder) {
        var self = this;
        self.builder = builder;
        builder.storage.getBuilderTemplate('builder-menu', function (err, data) {
            self.tpl = _.template(data);
            self.render();
        });
    },
    /**
     * Render menu
     * @returns {Object}
     */
    render: function () {
        this.$el.html(this.tpl());
        return this;
    },
    /**
     * Create menu (blocks, settings)
     */
    create: function () {
        this.createGroups();
        this.createBlocks();
    },
    /**
     * Create groups blocks
     */
    createGroups: function () {
        var menuGroupsView = new BuilderMenuGroupsView();
        this.addView(menuGroupsView, 0);
    },
    /**
     * Create blocks menu
     */
    createBlocks: function () {
        var blocksPreviewView = new BuilderMenuBlocksPreviewView();
        this.addView(blocksPreviewView, 90);
    },
    /**
     * Switching to inner field's settings 
     * @param {number} blockId
     * @param {string} markup
     */
    showInnerSettings: function (parentId, markup) {
        if (parentId === 'inner-settings-accordion') {
            jQuery("#inner-settings-accordion").hide();
        } else {
            this.hideAll();
        }

        jQuery('.blocks-settings').append(markup);
    },
    /**
     * Resize menu
     */
    resize: function () {
        this.$el.css({
            height: jQuery(window).height() - 70,
            top: 70
        });
    },
    /**
     * Menu rotation
     * @param {Integer} id
     * @param {Boolean} back Rotate back
     */
    rotate: function (id, back) {
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
        this.$el.find('.card-main')
                .removeClass(function (index, css) {
                    return (css.match(/\bside-\S+/g) || []).join(' ');
                })
                .addClass(this.currentSide);

        this.builder.toolbar.logoRotation(this.currentSide);
    },
    /**
     * Rotate menu back
     * Not used
     */
    back: function () {
        var tmp = this.backSide;

        // rotate cube menu
        this.$el.find('.card-main')
                .removeClass(function (index, css) {
                    return (css.match(/\bside-\S+/g) || []).join(' ');
                })
                .addClass(this.backSide);

        // Set back side
        this.backSide = this.currentSide;

        // Set current side
        this.currentSide = tmp;
    },
    /**
     * Add view to side cube
     * @param {Object} BackboneView  View from render
     * @param {String} side Side cube
     */
    addView: function (BackboneView, side) {
        jQuery('#side-' + side).append(BackboneView.el);
    }
});


