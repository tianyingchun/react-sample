var _ = require('lodash');
var path = require('path');
var url = require('url');
var webpack = require('webpack');
var webpackDevConfig = require('./webpack.dev.config');
var webpackProdConfig = require('./webpack.prod.config');
var buildConfig = require('../build.config');

var default_config = {
  devServer: {
    host: 'localhost',
    port: 3000
  }
};

var getPromptConfig = function (grunt, projects) {

  // project module choices.
  var moduleChoices = [];

  // project choices.
  var projectChoices = [{
    name: 'build_all_projects',
    value: 'build_all_projects',
    checked: true
  }];

  Object.keys(projects).forEach(function (projectName) {
    projectChoices.push({
      name: projectName,
      value: projectName
    });
  });

  var questions = [{
    config: 'list.all.projects',
    type: 'list',
    message: 'Which project would you like to build ?',
    default: 'build_all_projects',
    choices: projectChoices
  }, {
    config: 'build.specific.module',
    type: 'list',
    message: 'What specific module would you like to build ?',
    choices: function () {
      return moduleChoices;
    },
    when: function (answers) {
      var answer = answers['list.all.projects'];
      var buildAllProject = (answer === 'build_all_projects');

      // if we need to build specific module, need to return true.
      if (!buildAllProject) {
        var projectInfo = projects[answer];
        // build specific module
        Object.keys(projectInfo).forEach(function (moduleName) {
          moduleChoices.push({
            name: moduleName,
            value: moduleName
          });
        });

      }
      return !buildAllProject;
    },
    validate: function (value) {
      console.log('module', value);
      var modulePath = path.normalize(path.join('./', '', '/app/', value, '.js'));
      var existed = grunt.file.exists('modulePath');
      return existed || 'Must be a valid module, check ' + modulePath;
    }
  }, {
    config: 'build.all.project.confirm',
    type: 'confirm',
    message: 'Are you sure you need to compile all projects at a time?',
    when: function (answers) {
      var answer = answers['list.all.projects'];
      // if we will build all project need second confirm.
      return answer === 'build_all_projects';
    },
    validate: function (value) {
      console.log('confirm validate', value);
    }
  }];

  var prompt = {
    // for devBuild, prodBuild
    build: {
      options: {
        questions: questions,
        then: function (results, done) {
          // console.log('then().', results);
          var buildProjectName = results['list.all.projects'];

          if (buildProjectName === 'build_all_projects') {
            if (true === results['build.all.project.confirm']) {
              // TODO, to build all projects and it's modules.
              grunt.log.ok('building all projects defined in ./build.config.js');

              prepareBuildWebpackConfig('prodBuild', {});

              // we need to do production build here
              // grunt.task.run(['webpack']);
            } else {
              grunt.log.ok('Task `build all projects ` cancelled');
            }
          } else {
            var buildModule = results['build.specific.module'];
            grunt.log.ok('building: ', 'project[' + buildProjectName + ']' + '.' + 'module[' + buildModule + ']');

            // prepare build webpack config.
            prepareBuildWebpackConfig('prodBuild', {
              projectName: buildProjectName,
              moduleName: buildModule
            });

            // var webpackConfig = grunt.config.get('webpack');
            // var prod = webpackConfig.prod;
            // prod.entry = _.pick(prod.entry, ['library', buildModule]);
            // grunt.config.set('webpack', webpackConfig);
            // console.log(grunt.config.get('webpack').prod)
            // grunt.task.run(['webpack']);
          }

        }
      }
    },
    devServer: {
      // for dev hot server.
      options: {
        questions: questions,
        then: function (results, done) {

        }
      }
    }
  };

  return prompt;
};

/**
 * Dynamic prepare webpack grunt config section
 * @param  {String} mode 'prodBuild', 'devBuild', 'devServer'
 * @param  {Objeect} config      can be {} || {projectName:'', moduleName:''}
 * @return {void}
 */
function prepareBuildWebpackConfig(mode, config) {

  var buildProjects = buildConfig.projects || {};
  var projectName = config.projectName;
  var moduleName = config.moduleName;

  // specificed project name.
  if (projectName) {
    buildProjects = buildProjects[projectName] || {};
  }
  // specificed module name.
  if (moduleName) {
    buildProjects = _.pick(buildProjects, [moduleName]);
  }

  var webpackConfig = {};

  switch (mode) {
    case 'devBuild':
      Object.keys(buildProjects).forEach(function (projectName) {
        var project = buildProjects[projectName];
        var config = webpackDevConfig();
        // build output physic directory.
        config.output.path = path.join(default_config.built.baseDir, 'debug');
        config.output.filename = path.join(projectName, config.output.filename);
        // override webpack.dev.config.js
        _.extend(config.entry, project, function (dist, source) {
          if (source) {
            return [source.entry];
          }
        });
        webpackConfig[projectName] = config;
      });
      break;
    case 'prodBuild':
      Object.keys(buildProjects).forEach(function (projectName) {
        var project = buildProjects[projectName];
        var config = webpackProdConfig();
        console.log('config: ', webpackProdConfig)

        // build output physic directory.
        config.output.path = default_config.built.baseDir;
        config.output.filename = path.join(projectName, config.output.filename);
        // override webpack.prod.config.js
        _.extend(config.entry, project, function (dist, source) {
          if (source) {
            return [source.entry];
          }
        });
        webpackConfig[projectName] = config;
      });
      break;
    case 'devServer':
      // The webpack dev server socket config for development phase.
      var entry_dev_server = [
        'webpack-dev-server/client?' + url.format({
          protocol: 'http',
          hostname: default_config.devServer.host,
          port: default_config.devServer.port
        }), 'webpack/hot/only-dev-server'
      ];

      Object.keys(buildProjects).forEach(function (projectName) {
        var project = buildProjects[projectName];
        var config = webpackDevConfig();
        // build output physic directory.
        config.output.path = path.join(default_config.built.baseDir, 'debug');
        config.output.filename = path.join(projectName, config.output.filename);
        // override webpack.dev.config.js
        _.extend(config.entry, project, function (dist, source) {
          if (source) {
            return entry_dev_server.concat([source.entry]);
          }
        });
        webpackConfig[projectName] = config;
      });

      break;
  }

  console.log('webpackConfig:', JSON.stringify(webpackConfig))

}



function initBuildCfg(grunt, options) {

  // default build config dependancy.
  if (!grunt.file.exists('./build.config.js')) {
    grunt.fail.fatal("the `build.config.js` file is required, please place it to __dirname.");
    return;
  }

  // grunt-prompt task dependancy.
  if (!grunt.task.exists('prompt')) {
    grunt.fail.fatal("the `grunt-prompt` task is required, please config it to Gurntfile.js");
    return;
  }

  // grunt-webpack dependancy.
  if (!grunt.task.exists('webpack')) {
    grunt.fail.fatal("the `grunt-webpack` task is required, please config it to Gurntfile.js");
    return;
  }

  var buildProjects = buildConfig.projects || {};
  var buildConfigOptions = buildConfig.options || {};

  _.extend(default_config, buildConfigOptions, options);

  // set promp config for grunt.
  grunt.config.set('prompt', getPromptConfig(grunt, buildProjects));

}

// grunt `webpack-dev-server` task. required grunt-webpack task.
function registerWebpackDevServerTask(grunt) {
  grunt.registerTask('hotDevServer', function (projectName) {

    console.log('projectName: ', projectName);

    grunt.config.set('webpack-dev-server', {
      options: {
        webpack: webpackDevConfig,
        publicPath: default_config.devServer.publicPath
      },
      start: {
        keepAlive: true,
        hot: true,
        historyApiFallback: true,
        host: default_config.devServer.host,
        port: default_config.devServer.port,
        stats: {
          colors: true
        }
      }
    });
  });
}

function registerWebpackBuildTask(grunt) {

  if (grunt.task.exists('webpack_build')) {
    grunt.fail.fatal('the grunt `webpack_build` task has been existed, build engine initial failed.');
    return;
  }
  // customized `build` task for production, development: [grunt prodBuild, grunt devBuild]
  grunt.registerTask('webpack_build', function (mode) {

    var mode = mode ? 'dev' : 'prod';

    grunt.log.ok('----Run task `webpack_build` model: `' + mode + '`----');

    if (mode === 'dev') {
      // run development build directly.
      grunt.task.run([]);
    } else {
      // run prompt build flow for production build.
      grunt.task.run(['prompt:build']);
    }
  });
}

module.exports = function (grunt, options) {

  // initialize build configurations.
  initBuildCfg(grunt, options);


  registerWebpackDevServerTask(grunt);

  // register customized `build` task.
  registerWebpackBuildTask(grunt);
};
