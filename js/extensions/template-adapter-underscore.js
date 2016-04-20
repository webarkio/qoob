var BuilderExtensions = BuilderExtensions || {};
BuilderExtensions.templating = BuilderExtensions.templating || [];

BuilderExtensions.templating['underscore'] = function(template) {
    var compiledTemplate = _.template(template);
    return function(data) {
        return compiledTemplate(data);
    };
};