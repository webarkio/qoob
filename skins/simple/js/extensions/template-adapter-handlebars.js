var QoobExtensions = QoobExtensions || {};
QoobExtensions.templating = QoobExtensions.templating || [];

QoobExtensions.templating['handlebars'] = QoobExtensions.templating['hbs'] = function(template) {
    var compiledTemplate = Handlebars.compile(template);
    return function(data) {
        return compiledTemplate(data);
    };
};
