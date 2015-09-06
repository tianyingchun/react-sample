var webpack = require('webpack');
var webpackDevConfig = require('./webpack.dev.config');
var webpackProdConfig = require('./webpack.prod.config');

module.exports = function (grunt) {

  grunt.initConfig({
    webpack: {
      dev: webpackDevConfig,
      prod: webpackProdConfig
    },
    'webpack-dev-server': {
      options: {
        webpack: webpackDevConfig,
        publicPath: webpackDevConfig.output.publicPath
      },
      start: {
        keepAlive: true,
        hot: true,
        historyApiFallback: true,
        host: 'localhost',
        port: 3000,
        stats: {
          colors: true
        }
      }
    },
    watch: {
      app: {
        files: ['**/*.js'],
        tasks: ['webpack:dev'],
        options: {
          spawn: false,
        }
      }
    },
    prompt: {
      build: {
        options: {
          conifg: 'build.module',
          type: 'list',
          message: 'which module do you like to build?'
          questions: [{
            default: 'custom',
            choices: [{
              name: 'Build:  '.yellow + '(module `member`-?)'.yellow;
              value: 'member',
            }, {
              name: 'Build:  '.yellow + '(module `setting`-?)'.yellow;
              value: 'setting',
            }, {
              name: 'Custom: module ?.'.yellow + '   Specify module name...',
              value: 'custom',
            }],
            validate: function (value) {
              console.log('Prompt value: ', value);
            },
            when: function (answers) {
              console.log('answers: ', answers);
            },
            then: function (results, done) {

              console.log('do some other task');
              // done()
            }
          }, {
            config: 'build.module.name',
            type: 'input',
            message: 'What specific module would you like',
            when: function (answers) {
              return answers['build.module.name'] === 'custom';
            },
            validate: function (value) {
              var valid = semver.valid(value) && true;
              return valid || 'Must be a valid semver, such as 1.2.3-rc1. See ' + 'http://semver.org/'.blue.underline + ' for more details.';
            }
          }]
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);


  // The development server (the recommended option for development)
  grunt.registerTask('default', ['webpack-dev-server:start']);

  // Build and watch cycle (another option for development)
  // Advantage: No server required, can run app from filesystem
  // Disadvantage: Requests are not blocked until bundle is available,
  //               can serve an old app on too fast refresh
  grunt.registerTask('dev', ['webpack:dev', 'watch:app']);

  // Production build
  grunt.registerTask('prod', ['prompt:build' /*, 'webpack:prod'*/ ]);
};
