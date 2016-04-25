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
                this.showGroups();
            },
            /**
             * Create groups blocks
             */
            createGroups: function () {
                var menuGroupsView = new BuilderMenuGroupsView();
                jQuery('#builder-menu .groups').prepend(menuGroupsView.el);
            },
            /**
             * Create blocks menu
             */
            createBlocks: function () {
                var blocksPreviewView = new BuilderMenuBlocksPreviewView();
                jQuery('#builder-menu .list-group').append(blocksPreviewView.el);
            },
            /**
             * Show groups menu
             */
            showGroups: function () {
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
            },
            /**
             * Show blocks by group id
             * @param {Integer} groupId
             */
            showBlocks: function (groupId) {
                // rotate menu
                this.menuRotation(180);
                // rotate logo
                this.builder.toolbar.logoRotation(-180);

                this.hideAll();
                jQuery('#group-' + groupId).show();
            },
            /**
             * Show settings by block id
             * @param {Integer} blockId
             */
            showSettings: function (blockId) {

                if (blockId === "inner-settings-accordion") {
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
            },
            /**
             * Switching to inner field's settings 
             * @param {number} blockId
             * @param {string} markup
             */
            showInnerSettings: function (parentId, markup) {
                // logo rotation
                this.builder.toolbar.logoRotation(-360);
                // menu rotation
                this.menuRotation(360);
                // state rotate
                this.rotate = false;

                if (parentId === 'inner-settings-accordion') {
                    jQuery("#inner-settings-accordion").hide();
                    this.menuRotation(-360);
                } else {
                    this.hideAll();
                }
                // jQuery('#settings-block-' + blockId).hide();

                jQuery('.blocks-settings').append(markup);
            },
            /**
             * Hide group by id
             * @param {Integer} groupId
             */
            hideAll: function (groupId) {
                jQuery('.menu-block').hide();
            },
            /**
             * Resize menu
             */
            resize: function () {
                jQuery('#builder-menu').css({
                    height: jQuery(window).height() - 70,
                    top: 70
                });
            },
            /**
             * Menu rotation
             * @param {Integer} rot
             */
            menuRotation: function (rot) {
                jQuery('#builder-menu .card-main').css("transform", "rotateY(" + rot + "deg)");
            }
        });


