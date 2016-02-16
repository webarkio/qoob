var Fields = Fields || {};

/**
 * View field image
 */
Fields.image = Backbone.View.extend(
/** @lends Fields.image.prototype */{
    className: "settings-item",
    events: {
        'change input': 'changeInput',
        'click input': 'imageUpload',
        'click .cross-delete': 'deleteImage',
        'click .other-photo': 'changeImage'
        
    },
    /**
     * View field image
     * @class Fields.image
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
        this.model.set(target.attr('name'), target.prev().find('img').attr('src'));
    },
    /**
     * Get value field image
     * @returns {String}
     */
    getValue: function () {
        return this.model.get(this.config.name) || this.config.default;
    },
    /**
     * Image upload
     * @param {Object} evt
     */
    imageUpload: function (evt) {
        window.send_to_editor = function (html) {
            var img_url = jQuery('img', html).attr('src');
            var img = jQuery(evt.target).prev().show().find('img');
            
            jQuery(evt.target).parent().find('.title').find('.cross-delete').show();
            
            if (img != undefined && img != '') {
                img.attr('src', img_url);
                jQuery(evt.target).trigger("change");
            }

            tb_remove();
        };

        tb_show('Upload a Image', 'media-upload.php?referer=media_page&type=image&TB_iframe=true&post_id=0', false);
        return false;
    },
    /**
     * Delete image
     * @param {type} evt
     */
    deleteImage: function (evt) {
        jQuery(evt.target).hide();
        var item = jQuery(evt.target).parents('.settings-item');
        var name = item.find('input').prop('name');
        item.find('edit-image > img').attr('src', '');
        item.find('.edit-image').hide();
        if (this.$el.find('.other-photos').length) {
            this.$el.find('.other-photo').removeClass('active');
        }
        this.model.set(name, '');
    },
    /**
     * Get other photos
     * @returns {String}
     */
    getOherPhotos: function () {
        var images = '';
        for (var i = 0; i < this.config.images.length; i++) {
            images += '<div class="other-photo ' + (this.config.images[i] == this.getValue() ? 'active' : '') + '"><img src="' + this.config.images[i] + '"></div>';
        }
        return '<div class="other-photos">' + images + '</div>';
    },
    /**
     * Change other image
     * @param {Object} evt
     */
    changeImage: function (evt) {
        var elem = jQuery(evt.currentTarget);
        this.$el.find('.other-photo').removeClass('active');
        elem.addClass('active');
        this.$el.find('.edit-image img').attr('src', elem.find('img').attr('src'));
        this.$el.find('input').trigger("change");
        if (!this.$el.find('.edit-image').is(":visible")) {
            this.$el.find('.edit-image').show();
        }
    },
    /**
     * Create filed image
     * @returns {String}
     */
    create: function () {
        return '<div class="title"><div class="text">' + this.config.label + '</div>' +
                '<div class="cross-delete"><a href="#"></a></div></div>' +
                (this.config.images ? this.getOherPhotos() : '') +
                '<div class="edit-image"><img src="' + this.getValue() + '" /></div>' +
                '<input name="' + this.config.name + '" class="btn-upload btn-builder" type="button" value="Select Image" />';
    },
    /**
     * Render filed image
     * @returns {Object}
     */
    render: function () {
        if (typeof (this.config.show) == "undefined" || this.config.show(this.model)) {
            this.$el.html(this.create());
        }
        return this;
    }
});