var QoobExtensions = QoobExtensions || {};
QoobExtensions.templating = QoobExtensions.templating || [];

QoobExtensions.templating['underscore'] = function(template) {
    var compiledTemplate = _.template(template);
    return function(data) {
        return compiledTemplate(data);
    };
};