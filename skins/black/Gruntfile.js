'use strict';
module.exports = function(grunt) {
    var Skin = require('./skin.js');
    var skin = new Skin();
    var resources = [];
    for (var i = 0; i < skin.assets.dev.length; i++) {
        if (skin.assets.dev[i].type == "js") {
            resources.push(skin.assets.dev[i].src.replace("qoob/skins/black/", ""));
        }
    }

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            skin: {
                files: {
                    'skin.concated.js': resources
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.task.registerTask('concat_templates', 'A sample task that logs stuff.', function() {
        var jsonToSave = {};
        grunt.file.recurse("tmpl/", function(abspath, rootdir, subdir, filename) {
            if (filename.indexOf(".html") != -1) {
                jsonToSave[filename.replace(".html", "")] = grunt.file.read(abspath).replace(/^\s*|\s*\n\s*/g, '');
            }
        });
        grunt.file.write("tmpl/templates.json", JSON.stringify(jsonToSave));
    });

    grunt.registerTask('build', ['concat_templates', 'uglify']);
    grunt.registerTask('default', ['build']);
};
