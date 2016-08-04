
'use strict';
//configuration of grunt
module.exports = function(grunt) {

    var sources = [
        'src/S3ToolBox.js',
        'src/forms.js',
        'src/calculator.js',
        'src/eventManager.js',
        'src/btn.js',
        'src/template.js'
    ];
    
    
    // Project configuration.
    grunt.initConfig({
        
        //start config

        //clean
        clean:{
            dist: {
                src: ['dist/*.js']
            },
            test:{
                src:['test/*.js']
            }
        },

        //cancat
        concat:{
            dist:{
                src:sources,
                dest:'dist/S3ToolBox.js'
            }
        },

        //uglify  compress
        uglify:{
            dist:{
                files:[
                    {
                        src:'<%= concat.dist.dest %>',
                        dest:'dist/S3ToolBox.min.js'
                    }
                ]
            }
        }
    });

    //load dependency
    require('load-grunt-tasks')(grunt, {
        pattern: 'grunt-contrib-*',
        config: 'package.json',
        scope: 'devDependencies',
        requireResolution: true
    });

    //build task
    grunt.registerTask('build',['clean','concat','uglify']);

    grunt.registerTask('default',['build']);
};

