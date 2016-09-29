'use strict';
module.exports = function(grunt) {
    // load all tasks
    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build/*']
        },
        shell: {
            gitpull: {
                command: 'git pull origin master'
            }
        },
        concat: {
            options: {
                separator: ';\n'
            },
            dist: {
                src: [
                    'js/libs/bootstrap.min.js',
                    'js/libs/bootstrap-progressbar.js',
                    'js/libs/bootstrap-select.min.js',
                    'js/libs/handlebars.js',
                    'js/libs/handlebars-helper.js',
                    'js/libs/jquery-ui-droppable-iframe.js',
                    'js/libs/jquery.wheelcolorpicker.js',
                    'js/models/**.js',
                    'js/views/**.js',
                    'js/views/fields/**.js',
                    'js/extensions/**.js',
                    'js/controllers/qoob-controller.js',
                    'js/**.js'
                ],
                dest: 'qoob.concated.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Pull, concat js files, building docs
    grunt.registerTask('build', ['shell:gitpull', 'concat']);
};