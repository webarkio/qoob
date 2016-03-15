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

/*
 * Create global settings
 */
BuilderMenu.prototype.createGlobalControl = function (data) {
    var self = this;
    var iframe = this.builder.iframe.getWindowIframe();

    var global_settings = this.builder.builderData.global_settings;

    var settings = {};
    if (data && data.global_settings) {
        settings = data.global_settings;
    } else {
        for (var i = 0; i < global_settings.length; i++) {
            settings[global_settings[i].name] = global_settings[i].default;
        }
    }

    this.builder.getTemplate('global_settings', function (err, template) {
        var model = self.builder.createModel(settings);
        self.createBlockStyle(model, template, function (err, block) {
            self.createGlobalSettings(block.model, global_settings, function (err, container) {
                jQuery('#builder-menu .global-settings').append(container);
                iframe.jQuery('#builder-blocks').append(block.render().el);
                self.builder.builderSettingsData = block.model;
            });
        });
    });
};

/**
 * Create global settings view
 * 
 * @param {Object} model
 * @param {Object} config
 * @param {createSettingsCallback} cb - A callback to run.
 */
BuilderMenu.prototype.createGlobalSettings = function (model, config, cb) {
    var settingsBlock = new SettingsView({
        model: model,
        className: 'settings-block settings-scroll'
    });

    settingsBlock.config = config;
    var container = jQuery('<div class="settings"><div class="backward"><a href="#" onclick="builder.menu.showGroups();return false;">Back</a></div></div>');
    container.append(settingsBlock.render().el);
    cb(null, container);
};

/**
 * Create view block style
 * 
 * @param {Object} model
 * @param {String} template html block
 * @param {createBlockCallback} cb - A callback to run.
 */
BuilderMenu.prototype.createBlockStyle = function (model, template, cb) {
    var block = new BlockView({
        model: model,
        tagName: 'style',
        className: '',
        attributes: function () {
            return {
                'data-model-id': this.model.id
            }
        }
    });

    block.template = Handlebars.compile(template);
    cb(null, block);
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
    jQuery('#builder-menu .groups').prepend(res);
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
//    jQuery('#catalog-groups').show();

    // default position block settings
    this.rotate = false;

    // rotate menu
    this.menuRotation(90);

    // rotate logo
    this.builder.toolbar.logoRotation(-90);

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
    this.menuRotation(180);
    // rotate logo
    this.builder.toolbar.logoRotation(-180);

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

/**
 * Show global settings
 */
BuilderMenu.prototype.showGlobalSettings = function () {
    // default position block settings
    this.rotate = false;

    // rotate menu
    this.menuRotation(270);

    // rotate logo
    this.builder.toolbar.logoRotation(-270);

    // add Scrollbar
    var settingsScroll = jQuery('.global-settings').find('.settings-scroll');
    settingsScroll.perfectScrollbar();
    jQuery(window).resize(function () {
        settingsScroll.perfectScrollbar('update');
    });
};
