function LocalDriver() {}

/** 
 * @callback savePageDataCallback
 */

/**
 * Save page data
 * 
 * @param {integer} pageId
 * @param {Array} data DOMElements and JSON
 * @param {savePageDataCallback} cb - A callback to run.
 */
LocalDriver.prototype.savePageData = function(pageId, data, cb) {
    cb(true);
};

/**
 * Callback for get page data
 * 
 * @callback loadPageDataCallback
 */

/**
 * Get page data
 * 
 * @param {integer} pageId
 * @param {loadPageDataCallback} cb - A callback to run.
 */
LocalDriver.prototype.loadPageData = function(pageId, cb) {
    var data = [{"logo":"/wp-content/themes/pizza/img/header/logo_desktop.png","template":"header","id":"1"}];
    cb(null, data);
};


LocalDriver.prototype.loadBuilderData = function(cb) {
    var data = {"templates":[{"id":"about_us","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/about_us/"},{"id":"call_to_action","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/call_to_action/"},{"id":"contact_us","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/contact_us/"},{"id":"header","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/header/"},{"id":"map","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/map/"},{"id":"menu","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/menu/"},{"id":"slider","groups":"Content Sections","url":"http://pizza/wp-content/plugins/abuilder/blocks/slider/"}],"groups":[{"id":"Content Sections","label":"Content Sections","position":"1"},{"id":"Content Sections 2","label":"Content Sections 2","position":"0"}]};
    cb(null, data);
};

LocalDriver.prototype.loadTemplate = function(templateId, cb) {
    var template = "<div class=\"container-fluid template_header {{#if devices}}{{#splitString devices delimiter=\",\"}}visible_{{this}} {{/splitString}}{{/if}}\">            \r\n        <div class=\"img_block\">\r\n            <div class=\"hide_block_menu\">\r\n                <img src=\"/wp-content/themes/pizza/img/content/header_img_one.png\" class=\"z_comp pos_abs parallax_1 img_one\" alt=\"header_img_one\" data-depth=\"0.30\" />\r\n            </div>\r\n            <div>\r\n                <img src=\"/wp-content/themes/pizza/img/content/header_img_two.png\" class=\"z_comp pos_abs img_two pos_rel_mob parallax_2\" alt=\"header_img_two\" data-depth=\"0.40\"/>\r\n            </div>\r\n            <div class=\"hide_block_menu\">\r\n                <img src=\"/wp-content/themes/pizza/img/content/header_img_three.png\" class=\"z_comp pos_abs parallax_1 img_three\" alt=\"header_img_three\" data-depth=\"1.00\"/>\r\n            </div>\r\n            <div class=\"hide_block_menu\">\r\n                <img src=\"/wp-content/themes/pizza/img/content/header_img_four.png\" class=\"pos_abs bg_logo img_four parallax_3\" alt=\"header_img_four\" data-depth=\"0.60\"/>\r\n            </div>\r\n            {{#if logo}}\r\n                <div>\r\n                    <img src=\"{{ logo }}\" class=\"pos_abs logo pos_rel_mob parallax_2\" alt=\"header_logo\" data-depth=\"0.80\"/>\r\n                </div>\r\n            {{/if}}\r\n            <div class=\"text-left\">\r\n                <img src=\"/wp-content/themes/pizza/img/content/header_img_six.png\" class=\"pos_abs img_six parallax_3\" alt=\"header_img_six\" data-depth=\"0.35\"/>\r\n            </div>\r\n            <div>\r\n                <img src=\"/wp-content/themes/pizza/img/content/header_img_seven.png\" class=\"pos_abs img_seven parallax_3\" alt=\"header_img_seven\" data-depth=\"0.80\"/>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n    <div class=\"header_bedore\"></div>\r\n\r\n    <div class=\"container-fluid\">\r\n        <div class=\"row\">\r\n            <img src=\"/wp-content/themes/pizza/img/content/basket.png\" class=\"basket header_img_eight parallax_3\" alt=\"header_img_eight\" />\r\n        </div>\r\n    </div>";
    cb(null, template);
};


LocalDriver.prototype.loadSettings = function(templateId, cb) {
    var config = [{"name":"logo","label":"Logo","type":"image","default":"/wp-content/themes/pizza/img/header/logo_desktop.png"}];
    cb(null, config);
};
