
'use strict';
//configuration of grunt
module.exports = function(grunt) {

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

        //js test
        jshint: {
            options: {
                "bitwise": false, //位运算符
                "curly": true,  //循环必须用花括号包围
                "eqeqeq":true, //必须用三等号
                "es3":true,  //兼容低等浏览器
                "freeze":true,//禁止重写原生对象
                "indent":true, //代码进缩
                "latedef":true,//禁止定义之前使用变量
                "noarg":false,
                "globals": {
                    jQuery: true
                }
            },
            core: {
                src: ['src/*.js']
            }
        },
        //uglify  compress
        uglify:{
            dist:{
                files:[
                    {src:'src/S3ToolBox.js',dest:'dist/S3ToolBox.min.js'}
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

    //test task     commond:    grunt:test
    grunt.registerTask('test',['jshint']);

    //build task
    grunt.registerTask('build',['clean','uglify']);

    grunt.registerTask('default',['build']);
};

