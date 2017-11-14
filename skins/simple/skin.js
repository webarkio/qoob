/*global module, QoobStorage, QoobController, PageModel, QoobLayout*/
/**
 * Initialize page qoob
 *
 * @version 0.0.1
 * @class  Qoob
 * @param {Object} options [current page id and {Object} data]
 */
//module.exports.Qoob = Qoob;
function Skin() {
    this.assets = {
        "dev": [
            { "type": "js", "name": "jquery-ui", "src": "js/libs/jquery-ui.js", "min_src": "js/libs/jquery-ui.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "jquery-ui-touch-punch", "src": "js/libs/jquery.ui.touch-punch.js", "min_src": "js/libs/jquery.ui.touch-punch.min.js", "dep": ["jquery-ui"] },
            { "type": "js", "name": "jquery-ui-droppable-iframe", "src": "js/libs/jquery-ui-droppable-iframe.js", "min_src": "js/libs/jquery-ui-droppable-iframe.min.js", "dep": ["jquery-ui"] },
            { "type": "js", "name": "hammer", "src": "js/libs/hammer.js", "min_src": "js/libs/hammer.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "qoob-select", "src": "js/libs/qoob-select.js", "dep": ["jquery"] },
            { "type": "js", "name": "qoob-dropdown", "src": "js/libs/qoob-dropdown.js", "dep": ["jquery"] },
            { "type": "js", "name": "device", "src": "js/libs/device.js", "min_src": "js/libs/device.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "html2canvas", "src": "js/libs/html2canvas.js", "min_src": "js/libs/html2canvas.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "jquery.easing", "src": "js/libs/jquery.easing.js", "min_src": "js/libs/jquery.easing.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "date-time-picker", "src": "js/libs/date-time-picker.js", "min_src": "js/libs/date-time-picker.min.js", "dep": ["jquery"] },
            { "type": "js", "name": "qoob-controller", "src": "js/controllers/qoob-controller.js", "dep": ["backbone"] },
            { "type": "js", "name": "block-model", "src": "js/models/block-model.js", "dep": ["backbone"] },
            { "type": "js", "name": "page-model", "src": "js/models/page-model.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-block-view", "src": "js/views/qoob-block-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-block-wrapper-view", "src": "js/views/qoob-block-wrapper-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-edit-mode-button-view", "src": "js/views/qoob-edit-mode-button-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-field-view", "src": "js/views/qoob-field-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-fields-view", "src": "js/views/qoob-fields-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-layout", "src": "js/views/qoob-layout.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-sidebar-view", "src": "js/views/qoob-sidebar-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-menu-view", "src": "js/views/qoob-menu-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-toolbar-view", "src": "js/views/qoob-toolbar-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-viewport-view", "src": "js/views/qoob-viewport-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-menu-blocks-preview-view", "src": "js/views/qoob-menu-blocks-preview-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-menu-groups-view", "src": "js/views/qoob-menu-groups-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-menu-save-page-view", "src": "js/views/qoob-menu-save-page-template-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-settings-view", "src": "js/views/qoob-settings-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-import-export-view", "src": "js/views/qoob-import-export-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-page-templates-view", "src": "js/views/qoob-page-templates-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-accordion", "src": "js/views/fields/field-accordion.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-accordion-item", "src": "js/views/fields/field-accordion-item.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-accordion-item-settings", "src": "js/views/fields/field-accordion-item-settings.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-accordion-flip", "src": "js/views/fields/field-accordion-flip.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-accordion-item-flip", "src": "js/views/fields/field-accordion-flip-item.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-accordion-item-flip-settings", "src": "js/views/fields/field-accordion-flip-item-settings.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-checkbox-switch", "src": "js/views/fields/field-checkbox-switch.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-checkbox", "src": "js/views/fields/field-checkbox.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-colorpicker", "src": "js/views/fields/field-colorpicker.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-icon", "src": "js/views/fields/field-icon.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-image", "src": "js/views/fields/field-image.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-select", "src": "js/views/fields/field-select.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-radio", "src": "js/views/fields/field-radio.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-slider", "src": "js/views/fields/field-slider.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-text-autocomplete", "src": "js/views/fields/field-text-autocomplete.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-text", "src": "js/views/fields/field-text.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-textarea", "src": "js/views/fields/field-textarea.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-video", "src": "js/views/fields/field-video.js", "dep": ["backbone"] },
            { "type": "js", "name": "field-datepicker", "src": "js/views/fields/field-datepicker.js", "dep": ["backbone"] },
            { "type": "js", "name": "icon-center-view", "src": "js/views/fields/icon-center-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "image-center-view", "src": "js/views/fields/image-center-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "video-center-view", "src": "js/views/fields/video-center-view.js", "dep": ["backbone"] },
            { "type": "js", "name": "template-adapter-handlebars", "src": "js/extensions/template-adapter-handlebars.js", "dep": ["backbone"] },
            { "type": "js", "name": "template-adapter-underscore", "src": "js/extensions/template-adapter-underscore.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-storage", "src": "js/qoob-storage.js", "dep": ["backbone"] },
            { "type": "js", "name": "qoob-utils", "src": "js/qoob-utils.js", "dep": ["backbone"] },
            { "type": "css", "name": "font-awesome.css", "src": "css/font-awesome.css" },
            { "type": "css", "name": "glyphicons.css", "src": "css/glyphicons.css" }
        ],
        "prod": [
            { "type": "js", "name": "skin_assets", "src": "skin.concated.js" },
        ],
        "all": [
            
            { "type": "css", "name": "jquery-ui.css", "src": "css/jquery-ui.css" },
            { "type": "css", "name": "quill.sno.css", "src": "js/libs/quill/quill.snow.css" },
            { "type": "css", "name": "qoob.css", "src": "css/qoob-backend.css" },
            { "type": "json", "name": "skin_templates", "src": "tmpl/templates.json" },
            { "type": "json", "name": "skin_translation", "src": "translation.json" },
            { "type": "js", "name": "quill", "src": "js/libs/quill/quill.js", "min_src": "js/libs/quill/quill.min.js", "dep": ["jquery"] },
        ]
    };
}

/**
 * Activate page qoob
 */
Skin.prototype.activate = function(options) {

    var self = this;

    this.options = {
        blockTemplateAdapter: 'hbs',
        blockPreviewUrl: "preview.png",
        skinUrl: options.skinUrl
    };
    _.extend(this.options, options);

    this.loader = this.options.loader;

    this.storage = new QoobStorage(this.options);

    this.controller = new QoobController();

    this.pageModel = new PageModel();

    this.layout = new QoobLayout({
        "model": this.pageModel,
        "storage": this.storage,
        "controller": this.controller
    });

    this.controller.setLayout(this.layout);
    this.controller.setPageModel(this.pageModel);
    this.controller.setStorage(this.storage);

    //Creating and appending qoob layout
    jQuery(window).resize(function() {
        self.layout.resize();
    });


    //Blocks loaded to viewPort
    self.layout.viewPort.once('blocks_loaded', function() {
        self.loader.trigger('skin_loaded');
        Backbone.history.start({ pushState: false });
    });

    //If iframe ready to load blocks. All libraries css and js have already loaded to iframe
    self.layout.viewPort.once('iframe_loaded', function() {

        var iframe = self.layout.viewPort.getWindowIframe();

        //css is loaded to iframe
        iframe.loader.once('loaded', function() {
            // self.layout.viewPort.getWindowIframe().onbeforeunload = function() {
            //     return false;
            // };

            //  load default templates
            self.layout.viewPort.createBlankPage();

            //Start loading blocks
            self.controller.load(self.storage.pageData.blocks);
        });
        //add css styles for overlay and drop zone
        iframe.loader.add({ "name": "frontend-qoob-css", "src": self.options.skinUrl + "css/qoob-frontend.css", "type": "css" })

        return;

    });

    //Render layout
    jQuery('body').prepend(self.layout.render().el);

    this.layout.resize();
};


if (typeof(module) != 'undefined' && module.exports) {
    module.exports = Skin;
}