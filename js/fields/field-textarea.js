var Fields = Fields || {};
Fields.textarea = Backbone.View.extend(
/** @lends Fields.textarea.prototype */{
    className: "settings-item",
    events: {
        'change textarea': 'changeTextarea'
    },
    /**
     * View field textarea
     * @class Fields.textarea
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
    },
    /**
     * Event change textarea
     * @param {Object} evt
     */
    changeTextarea: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Get value field textarea
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Create filed textarea
     * @returns {String}
     */
    create: function () {
        textareaId = _.uniqueId('textarea');

        return '<div class="title">' + this.config.label + '</div>' + '<textarea class="wpb-textarea visual_composer_tinymce content textarea_html wp-editor-area" id="' + textareaId + '"  rows="5" cols="27" name="' + this.config.name + '">' + this.getValue() + '</textarea>' +
                '<script type="text/javascript">' +
                'tinymce.init({' +
                'theme: "-modern",' +
                'object_resizing: false,' +
                'menubar: false,' +
                'toolbar: "undo redo | bullist numlist | styleselect | bold italic | link image",' +
                'statusbar: false,' +
                'paste_as_text: true,' +
                'selector: "textarea#' + textareaId + '",' +
                'setup: function (ed) {' +
                'ed.on("touchstart",function(e) {' +
                'console.log("touchstart");'+
                     
                 
                '}),' +
                'ed.on("keyup undo redo change init",function(e) {' +
                    'jQuery(ed.getBody()).on("blur", function(e) {' +
                   '    console.log("blur");'+
                   '});' +
                   'jQuery(ed.getBody()).on("focus", function(e) {' +
                       'console.log("focus");' +
                   '});' +
                'var content = tinyMCE.get(ed.id).getContent();' +
                'var escapedClassName = ed.id.replace(/(\[|\])/g, "\\$&");' +
                'jQuery("#' + textareaId + '").html(content).trigger("change");' +
                '});' +
                '}' +
                '})' +
                '</script>';
    },
    /**
     * Render filed textarea
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});