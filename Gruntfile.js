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
        compress: {
            stable: {
                options: {
                    archive: 'build/qoob_<%= pkg.version %>.zip'
                },
                expand: true,
                src: [
                    '**/*',
                    '!tests/**',
                    '!**/tests/**',
                    '!node_modules/**',
                    '!presentation/**',
                    '!.git/**',
                    '!build/**',
                    '!docs/dest/**',
                    '!docs/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!assets/screenshots/**',
                    '!**/package.json',
                    '!jsdoc.json'
                ],
                dest: 'qoob/'
            }
        },
        shell: {
            gitpull: {
                command: 'git pull'
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
                src: ['qoob/js/libs/bootstrap.min.js', 'qoob/js/libs/bootstrap-progressbar.js',
                    'qoob/js/libs/bootstrap-select.min.js', 'qoob/js/libs/handlebars.js', 'qoob/js/libs/handlebars-helper.js',
                    'qoob/js/libs/jquery-ui-droppable-iframe.js', 'qoob/js/libs/jquery.wheelcolorpicker.js', 'qoob/js/models/**.js', 'qoob/js/views/**.js',
                    'qoob/js/views/fields/**.js', 'qoob/js/extensions/**.js', 'qoob/js/controllers/qoob-controller.js', 'qoob/js/**.js', 'assets/js/control-edit-page.js'
                ],
                dest: 'qoob/qoob.concated.js'
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
    // Load concating js plugin
    grunt.loadNpmTasks('grunt-contrib-concat');
    //Load the shell plugin
    grunt.loadNpmTasks('grunt-shell');
    //Clean plugin
    grunt.loadNpmTasks('grunt-contrib-clean');
    // Copy files
    grunt.loadNpmTasks('grunt-contrib-copy');
    // load assemble
    grunt.loadNpmTasks('grunt-assemble');

    //Build
    grunt.registerTask('build', ['clean:build', 'shell:gitpull', 'concat', 'compress:stable']);

    //Deploy docs
    grunt.registerTask('docs', ['clean:docs', 'assemble', 'copy:style', 'copy:fonts', 'copy:js', 'copy:img', 'shell:api']);
};