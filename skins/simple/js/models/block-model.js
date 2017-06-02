var BlockModel = Backbone.Model.extend({
    toJSON: function () {
        var data = Backbone.Model.prototype.toJSON.apply(this, arguments);
        for (var i = 0; i < data.length; i++) {
            if (data[i] instanceof Backbone.Collection) {
                data[i] = JSON.parse(JSON.stringify(data[i]));
            }
        }
        return data;
    }
});
