
'use strict';
//configuration of grunt
module.exports = function(grunt) {

    var sources = [
        'src/s3toolbox.js',
        'src/ajax.js',
        'src/autocomplete.js',
        'src/forms.js',
        'src/calculator.js',
        'src/eventManager.js',
        'src/element.js',
        'src/istore.js',
        'src/menu.js',
        'src/page.js',
        'src/table.js',
        'src/template.js',
        'src/utils.js',
        'src/validate.js',
        'src/json.js'
    ];
    
    
    // Project configuration.
    grunt.initConfig({
        
        //start config
        pkg:grunt.file.readJSON('package.json'),
        //clean
        clean:{
            dist: {
                src: ['dist/*.js']
            }
        },

        //cancat
        concat:{
            dist:{
                src:sources,
                dest:'dist/<%= pkg.name %>.js'
            }
        },

        //uglify  compress
        uglify:{
            dist:{
                files:[
                    {
                        src:'<%= concat.dist.dest %>',
                        dest:'dist/<%= pkg.name %>.min.js'
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

