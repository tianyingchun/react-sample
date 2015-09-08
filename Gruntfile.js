module.exports = function (grunt) {

  grunt.initConfig({
    // Eslint task for current project.
    eslint: {
      //http://eslint.org/docs/rules/
      options: {
        configFile: '.eslintrc'
      },
      react: [
        './workspace/**/*{.jsx,.js}'
      ]
    },
    nodemon: {
      isomorphic: {
        script: './isomorphic',
        options: {
          nodeArgs: [ /*'--debug', '--harmony'*/ ],
          ignore: ['node_modules/**'],
          env: {
            PORT: '2000',
            // for development, isomorphic server render react
            NODE_ENV: 'development',
            DEBUG_COLORS: true
          },
          ext: 'js,jsx,html,ejs'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  // Load customized webpack build infrastructure.
  require('./buildtool')(grunt, {});

  // Wraper buildtool `webpack_build` task.
  grunt.registerTask('prodBuild', 'The customized webpack production build task', function () {
    grunt.task.run(['webpack_build']);
  });

  // Dependency `buildtool`
  // Build development version with bundle.js with source map to target built directory.
  // Normally we don't need run this task, unless you want to debug built file in another remote merchine without dev-hot-server.
  grunt.registerTask('devBuild', 'The costomized webpack development build task ', function () {
    grunt.task.run(['eslint', 'webpack_build:dev']);
  });


  // The development server (the recommended option for development)
  grunt.registerTask('hotDevServer', function (projectName) {
    if (!projectName) {
      grunt.fail.fatal('you must provider project you for dev server');
    }
    grunt.task.run(['hotDevServer:' + projectName]);
  });
};
