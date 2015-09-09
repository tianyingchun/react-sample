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

/**
 * Run webpack build while prompt flow end.
 * @param  {Object} grunt
 * @param  {Object} promptResult  Prompt Result.
 * @param  {String} mode         'devBuild', 'prodBuild'
 * @return {void}
 */
function runBuildTask(grunt, promptResult, mode) {
  var buildProjectName = promptResult['list.all.projects'];

  if (buildProjectName === 'build_all_projects') {
    if (true === promptResult['build.all.project.confirm']) {

      // to build all projects and it's modules.
      grunt.log.ok('building all projects defined in ./build.config.js');

      // prepare grunt-webpack configuration.
      grunt.config.set('webpack', prepareBuildWebpackConfig(grunt, mode, {}));

      // run `webpack` task
      grunt.task.run(['webpack']);
    } else {
      grunt.log.ok('Task `build all projects ` cancelled');
    }
  } else {
    var buildModule = promptResult['build.specific.module'];
    grunt.log.ok('building: ', 'project[' + buildProjectName + ']' + '.' + 'module[' + buildModule + ']');

    if (buildModule === 'build_all_modules') {
      buildModule = '';
    }
    // prepare grunt-webpack configuration.
    grunt.config.set('webpack', prepareBuildWebpackConfig(grunt, mode, {
      projectName: buildProjectName,
      moduleName: buildModule
    }));

    // run `webpack` task
    grunt.task.run(['webpack']);
  }
}
var getPromptConfig = function (grunt, projects) {

  // project module choices.
  var moduleChoices = [{
    name: 'build_all_modules',
    value: 'build_all_modules',
    checked: true
  }];

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
    }
  }, {
    config: 'build.all.project.confirm',
    type: 'confirm',
    message: 'Are you sure you need to compile all projects at a time?',
    when: function (answers) {
      var answer = answers['list.all.projects'];

      // if we will build all project need second confirm.
      return answer === 'build_all_projects';
    }
  }];

  var prompt = {
    devBuild: {
      // for `devBuild` prompt.
      options: {
        questions: questions,
        then: function (results, done) {
          // console.log('then().', results);
          runBuildTask(grunt, results, 'devBuild');
        }
      }
    },
    prodBuild: {
      // for `prodBuild` prompt.
      options: {
        questions: questions,
        then: function (results, done) {
          runBuildTask(grunt, results, 'prodBuild');
        }
      }
    }
  };

  return prompt;
};

/**
 * get specificed webpack via various conditions.
 * @param  {String} mode        'devServer','devBuild','prodBuild'
 * @param  {Object} projects     projects defined in build.config.js
 * @return {Object}              webpack configuration
 */
function getWebpackConfig(mode, projects) {
  var result = {};

  // The webpack dev server socket config for development phase.
  var dev_server_entry = [
    'webpack-dev-server/client?' + url.format({
      protocol: 'http',
      hostname: default_config.devServer.host,
      port: default_config.devServer.port
    }), 'webpack/hot/only-dev-server'
  ];

  Object.keys(projects).forEach(function (projectName) {
    var webpack = null;
    var project = projects[projectName];

    switch (mode) {
      // hot dev server
      case 'devServer':
        webpack = webpackDevConfig();
        webpack.output.path = default_config.built.baseDir;
        // Add source mapping for debuging.
        webpack.devtool = 'eval';
        // override webpack.entry
        _.extend(webpack.entry, project, function (dist, source) {
          if (source) {
            return dev_server_entry.concat([source.entry]);
          }
        });

        break;
      case 'devBuild':
        webpack = webpackDevConfig();
        webpack.output.path = path.join(default_config.built.baseDir, 'debug');

        // override webpack.entry
        _.extend(webpack.entry, project, function (dist, source) {
          if (source) {
            return [source.entry];
          }
        });

        break;
      case 'prodBuild':
        webpack = webpackProdConfig();
        webpack.output.path = default_config.built.baseDir;

        // override webpack.entry
        _.extend(webpack.entry, project, function (dist, source) {
          if (source) {
            return [source.entry];
          }
        });

        break;
    }

    var oExtractTextPlugin = _.find(webpack.plugins, function (item) {
      return 'ExtractTextPlugin' === item.constructor.name;
    });

    var oModuleUrlLoader = _.find(webpack.module.loaders, function (item) {
      return item.loader === 'url-loader';
    });

    // Set dist location for transfer url resources.
    // oModuleUrlLoader.query.name = path.join(projectName, oModuleUrlLoader.query.name );

    // mapping real path to corresponding project.
    oExtractTextPlugin.filename = path.join(projectName, oExtractTextPlugin.filename);
    webpack.output.filename = path.join(projectName, webpack.output.filename);

    result[projectName] = webpack;
  });

  return result;
}
/**
 * Dynamic prepare webpack grunt config section
 * @param  {Object} grunt
 * @param  {String} mode        'devServer','devBuild','prodBuild'
 * @param  {Object} config      can be {} || { projectName:'', moduleName:'' }
 * @return {Object}              webpack configuration
 */
function prepareBuildWebpackConfig(grunt, mode, config) {

  var buildProjects = buildConfig.projects || {};
  var projectName = config.projectName;
  var moduleName = config.moduleName;

  // specificed project name.
  if (projectName) {
    if (!buildProjects[projectName]) {
      grunt.fail.fatal('The project `' + projectName + '` can not be fund in build.config.js')
      return;
    }
    buildProjects = _.pick(buildProjects, [projectName]);
  }

  // specificed module name.
  if (moduleName) {
    if (!buildProjects[projectName][moduleName]) {
      grunt.fail.fatal('The project `' + projectName + '`.`' + moduleName + '` can not be fund in build.config.js')
      return;
    }
    buildProjects[projectName] = _.pick(buildProjects[projectName], [moduleName]);
  }

  var webpack = getWebpackConfig(mode, buildProjects);

  // console.log('webpackConfig:', JSON.stringify(webpack))

  return webpack;
}

/**
 * Initialize build configurations
 * @param  {Object} grunt
 * @param  {Object} options the build options
 * @return {void}
 */
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

  // merge build config options.
  _.extend(default_config, buildConfigOptions, options);

  // set grunt prompt config
  grunt.config.set('prompt', getPromptConfig(grunt, buildProjects));

}

// grunt `webpack-dev-server` task. required grunt-webpack task.
function registerWebpackHotDevServerTask(grunt) {
  grunt.registerTask('hot_dev_server', function (projectName) {
    if (!buildConfig.projects[projectName]) {
      grunt.fail.fatal('The project `' + projectName + '` can not be fund in build.config.js')
      return;
    }
    var config = {
      options: {
        webpack: prepareBuildWebpackConfig(grunt, 'devServer', {
          projectName: projectName
        })[projectName],
        publicPath: default_config.devServer.publicPath
      }
    };

    config[projectName] = {
      keepAlive: true,
      hot: true,
      historyApiFallback: true,
      host: default_config.devServer.host,
      port: default_config.devServer.port,
      stats: {
        colors: true
      }
    };
    grunt.config.set('webpack-dev-server', config);

    // run prompt devServer build flow for local development phase.
    grunt.task.run(['webpack-dev-server:' + projectName]);

  });
}
/**
 * Register grunt task `webpack_build:` based on webpack
 * @param  {Object} grunt
 * @return {void}
 */
function registerWebpackBuildTask(grunt) {

  if (grunt.task.exists('webpack_build')) {
    grunt.fail.fatal('the grunt `webpack_build` task has been existed, build engine initial failed.');
    return;
  }
  // customize `build` task for production
  // development: [grunt prodBuild, grunt devBuild]
  grunt.registerTask('webpack_build', function (mode) {

    grunt.log.ok('----Run task `webpack_build` model: `' + mode + '`----');

    switch (mode) {
      case 'devBuild':

        // run dev build with `sourcemap`.
        grunt.task.run(['prompt:devBuild']);
        break;
      case 'prodBuild':

        // run prod build flow for production build.
        grunt.task.run(['prompt:prodBuild']);
        break;
      default:
        grunt.fail.fatal('Can not supports task `webpack_build:' + mode + '`');
    }
  });
}

module.exports = function (grunt, options) {

  // initialize build configurations.
  initBuildCfg(grunt, options);

  // bind customized `build` task.
  registerWebpackBuildTask(grunt);

  // bind webpack dev server task.
  registerWebpackHotDevServerTask(grunt);
};
