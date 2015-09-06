var webpack = require('webpack');
var _ = require('lodash');
var webpackDevConfig = require('./webpack.dev.config');
var webpackProdConfig = require('./webpack.prod.config');
var buildConfig = require('./build.config');

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
    prompt: {}
  });

  require('load-grunt-tasks')(grunt);

  var getDefaultPrompt = function (projectName, projectCfg) {

    var choices = [{
      value: 'custom',
      name: 'Custom: specify ' + projectName + ' module.',
      checked: true
    }];
    var questions = [{
      config: 'build.' + projectName,
      type: 'list',
      message: 'Which module do you like to build ?',
      default: 'custom',
      choices: choices
    }, {
      config: 'build.' + projectName + '.module',
      type: 'input',
      message: 'What specific module would you like to build?',
      when: function (answers) {
        return answers['build.' + projectName] === 'custom';
      },
      validate: function (value) {
        var modulePath = './' + projectName + '/app/' + value + '.js';
        var existed = grunt.file.exists(modulePath);
        return existed || 'Must be a valid module, check ' + modulePath;
      }
    }];

    var prompt = {
      options: {
        questions: questions,
        then: function (results, done) {
          console.log('then().', results);
        }
      }
    };
    Object.keys(projectCfg).forEach(function (item) {
      choices.push({
        name: item,
        value: item
      });
    });
    return prompt;
  };

  // Production build
  grunt.registerTask('prod', function (moduleName) {
    // The default module name is `default`
    var target = moduleName || 'default';
    var prompt = {};
    Object.keys(buildConfig).forEach(function (item) {
      prompt[item] = getDefaultPrompt(item, buildConfig[item]);
    });
    grunt.config.set('prompt', prompt);

    grunt.task.run(['prompt:' + target]);
  });

  // The development server (the recommended option for development)
  grunt.registerTask('default', ['webpack-dev-server:start']);

  // Build and watch cycle (another option for development)
  // Advantage: No server required, can run app from filesystem
  // Disadvantage: Requests are not blocked until bundle is available,
  //               can serve an old app on too fast refresh
  grunt.registerTask('dev', ['webpack:dev', 'watch:app']);

};
