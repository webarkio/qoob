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
            build: ['build/*'],
            docs: ['docs/dest/*', 'docs/dest/**']
        },
        assemble: {
            options: {
                layout: "default.hbs",
                layoutdir: 'docs/src/layouts',
                data: 'docs/src/data/*.json',
                flatten: true
            },
            pages: {
                files: {
                    'docs/dest/': ['docs/src/*.hbs']
                }
            }
        },
        shell: {
            gitpull: {
                command: 'git pull origin master'
            },
            api: {
                command: 'node node_modules/jsdoc/jsdoc.js -c jsdoc.json -d docs/dest/api -t docs/jsdoc/template/jaguar'
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
        },
        copy: {
            style: {
                files: [
                    {
                        expand: true,
                        cwd: 'docs/src/css/',
                        src: ['**'],
                        dest: 'docs/dest/css/'
                    }
                ],
            },
            fonts: {
                files: [{
                        expand: true,
                        cwd: 'docs/src/fonts/',
                        src: ['**'],
                        dest: 'docs/dest/fonts/'
                    }]
            },
            js: {
                files: [
                    {
                        expand: true,
                        cwd: 'docs/src/js/',
                        src: ['**'],
                        dest: 'docs/dest/js/'
                    }
                ]
            },
            img: {
                files: [
                    {
                        expand: true,
                        cwd: 'docs/src/img/',
                        src: ['**'],
                        dest: 'docs/dest/img/'
                    }
                ],
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-assemble');

    // Pull, concat js files, building docs
    grunt.registerTask('build', ['shell:gitpull', 'concat', 'docs']);

    // Deploy docs
    grunt.registerTask('docs', ['clean:docs', 'assemble', 'copy:style', 'copy:fonts', 'copy:js', 'copy:img', 'shell:api']);
};