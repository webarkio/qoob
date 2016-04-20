var BuilderExtensions = BuilderExtensions || {};
BuilderExtensions.templating = BuilderExtensions.templating || [];

BuilderExtensions.templating['handlebars'] = BuilderExtensions.templating['hbs'] = function(template) {
    var compiledTemplate = Handlebars.compile(template);
    return function(data) {
        return compiledTemplate(data);
    };
};
