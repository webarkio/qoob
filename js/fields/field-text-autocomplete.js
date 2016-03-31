var Fields = Fields || {};
Fields.text_autocomplete = Backbone.View.extend(
/** @lends Fields.text_autocomplete.prototype */{
    className: "settings-item",
    uniqueId: null,
    events: {
        'keyup input': 'changeInput'
    },
    /**
     * View field text
     * @class Fields.text
     * @augments Backbone.View
     * @constructs
     */
    initialize: function () {
    },
    /**
     * Event change input
     * @param {Object} evt
     */
    changeInput: function (evt) {
        var target = jQuery(evt.target);
        this.model.set(target.attr('name'), target.val());
    },
    /**
     * Get value field text
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Get unique id
     * @returns {String}
     */
    getUniqueId: function () {
        return this.uniqueId = this.uniqueId || _.uniqueId('text-');
    },
    /**
     * Create filed text
     * @returns {String}
     */
    create: function () {

        return '<script type="text/javascript">' +
                'jQuery("#' + this.getUniqueId() + '").autocomplete({' +
                      'source: function(request, callback){' +
                      'var searchParam = request.term;' +
                      'init(searchParam, callback);' +
                      '}' +
                '});' +
                'function init(query, callback) {' +
                    'var response = [];' +
                    'var inputs = jQuery("#' + this.getUniqueId() + '").parents(".ui-accordion").find(".text-autocomplete");' +                    
                    'inputs.each(function() {' +
                        'if (! _.contains(response, jQuery(this).val())) {' +
                            'response.push(jQuery(this).val());' +
                        '}' +
                    '});' +
                    'callback(response);' +
                '};' +
                '</script>' +
                '<div class="title">'+this.config.label+'</div>' + '<input id="' + this.getUniqueId() + '" class="input-text text-autocomplete" type="text" name="' + this.config.name + '" value="' + this.getValue() + '" placeholder="'+ this.config.placeholder +'">';
    },
    /**
     * Render filed text
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});