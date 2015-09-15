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

      // to build all projects and it's sub projects.
      grunt.log.ok('building all projects defined in ./build.config.js');

      // prepare grunt-webpack configuration.
      grunt.config.set('webpack', prepareBuildWebpackConfig(grunt, mode, {}));

      // run `webpack` task
      grunt.task.run(['webpack']);
    } else {
      grunt.log.ok('Task `build all projects ` cancelled');
    }
  } else {
    var buildSubProject = promptResult['build.specific.subproject'];
    grunt.log.ok('building: ', 'project[' + buildProjectName + ']' + '.' + 'subProject[' + buildSubProject + ']');

    if (buildSubProject === 'build_all_sub_projects') {
      buildSubProject = '';
    }
    // prepare grunt-webpack configuration.
    grunt.config.set('webpack', prepareBuildWebpackConfig(grunt, mode, {
      projectName: buildProjectName,
      subProjectName: buildSubProject
    }));

    // run `webpack` task
    grunt.task.run(['webpack']);
  }
}
var getPromptConfig = function (grunt, projects) {

  // sub project choices.
  var subProjectChoices = [{
    name: 'build_all_sub_projects',
    value: 'build_all_sub_projects',
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
    config: 'build.specific.subproject',
    type: 'list',
    message: 'What specific sub project would you like to build ?',
    choices: function () {
      return subProjectChoices;
    },
    when: function (answers) {
      var answer = answers['list.all.projects'];
      var buildAllProject = (answer === 'build_all_projects');

      // if we need to build specific sub project, need to return true.
      if (!buildAllProject) {
        var projectInfo = projects[answer];
        // build specific sub project
        Object.keys(projectInfo).forEach(function (subProjectName) {
          subProjectChoices.push({
            name: subProjectName,
            value: subProjectName
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
 * @param  {Object} grunt
 * @param  {String} mode        'devServer','devBuild','prodBuild'
 * @param  {Object} projects     projects defined in build.config.js
 * @return {Object}              webpack configuration
 */
function getWebpackConfig(grunt, mode, projects) {
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
    // create build task config 'project.subProject'
    Object.keys(project).forEach(function (subProjectName) {

      // current subProject.
      var subProject = project[subProjectName];

      // console.log('subProject', project, subProject)
      switch (mode) {
        // hot dev server
        case 'devServer':
          webpack = webpackDevConfig();
          webpack.output.path = default_config.built.baseDir;
          webpack.output.publicPath = default_config.assets.dev;

          // Add source mapping for debuging.
          // use sourcemap, convenient for debugging.
          webpack.devtool = 'eval-source-map';

          // override webpack.entry
          webpack.entry[subProjectName] = dev_server_entry.concat([subProject.entry]);

          break;
        case 'devBuild':
          webpack = webpackDevConfig();
          webpack.output.path = path.join(default_config.built.baseDir, 'debug');
          webpack.output.publicPath = default_config.assets.dev;

          // override webpack.entry
          webpack.entry[subProjectName] = [subProject.entry]

          break;
        case 'prodBuild':
          webpack = webpackProdConfig();
          webpack.output.path = default_config.built.baseDir;
          webpack.output.publicPath = default_config.assets.prod;

          // override webpack.entry
          webpack.entry[subProjectName] = [subProject.entry];

          break;
      }

      var oExtractTextPlugin = _.find(webpack.plugins, function (item) {
        return 'ExtractTextPlugin' === item.constructor.name;
      });

      var oModuleUrlLoader = _.find(webpack.module.loaders, function (item) {
        return item.loader === 'url-loader';
      });

      // Set dist location for transfer url resources.
      _.extend(oModuleUrlLoader.query, _.mapValues(default_config.assets.urlLoaderQuery, function (val) {
        return _.template(val)({
          projectName: projectName
        });
      }));


      // Dynamic generate jsBundles, cssBundles for corresponding project.
      // ------------------------------------------------------------------
      // workspace/member/v1000/bundle.js --with version.
      // workspace/member/bundle.js
      // filename: '${projectName}/${subProjectName}/${version}/bundle.js'

      var cssBundlePath = path.normalize(_.template(oExtractTextPlugin.filename)({
        projectName: projectName,
        version: subProject.version || ''
      }));

      grunt.log.writeln('\n---------------------------------------------------\n');
      grunt.log.ok('cssBundlePath:' + cssBundlePath);

      oExtractTextPlugin.filename = cssBundlePath;
      var jsBundlePath = path.normalize(_.template(webpack.output.filename)({
        projectName: projectName,
        version: subProject.version || ''
      }));

      grunt.log.ok('jsBundlePath:' + jsBundlePath);

      webpack.output.filename = jsBundlePath; //'[name].dev-hot.entry.js';

      var task_target_name = projectName + '.' + subProjectName;

      grunt.log.ok('webpack task target name: ', task_target_name);

      grunt.log.writeln('\n---------------------------------------------------');

      result[task_target_name] = webpack;

    });

  });

  return result;
}
/**
 * Dynamic prepare webpack grunt config section
 * @param  {Object} grunt
 * @param  {String} mode        'devServer','devBuild','prodBuild'
 * @param  {Object} config       can be {} || { projectName:'', subProjectName:'' }
 * @return {Object}              webpack configuration
 */
function prepareBuildWebpackConfig(grunt, mode, config) {

  var buildProjects = buildConfig.projects || {};
  var projectName = config.projectName;
  var subProjectName = config.subProjectName;

  // specificed project name.
  if (projectName) {
    if (!buildProjects[projectName]) {
      grunt.fail.fatal('The project `' + projectName + '` can not be fund in build.config.js')
      return;
    }
    buildProjects = _.pick(buildProjects, [projectName]);
  }

  // specificed subProject name.
  if (subProjectName) {
    if (!buildProjects[projectName][subProjectName]) {
      grunt.fail.fatal('The project `' + projectName + '`.`' + subProjectName + '` can not be fund in build.config.js')
      return;
    }
    buildProjects[projectName] = _.pick(buildProjects[projectName], [subProjectName]);
  }

  var webpack = getWebpackConfig(grunt, mode, buildProjects);

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

  // look at if project is valid.
  Object.keys(buildProjects).forEach(function (projectName) {
    var projectLocalDir = path.join(__dirname, '..', projectName);
    if (!grunt.file.isDir(projectLocalDir)) {
      grunt.fail.fatal('The project `' + projectName + '` found in ./build.config.js but not real existed in' + projectLocalDir);
      delete buildProjects[projectName];
      // skip this project config if the project it not exist.
      return;
    }
  });

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
    var devHotConfig = prepareBuildWebpackConfig(grunt, 'devServer', {
      projectName: projectName
    });

    var entries = {};
    var targetConfig = null;
    Object.keys(devHotConfig).forEach(function (taskTargetName) {
      if (targetConfig === null) {
        targetConfig = devHotConfig[taskTargetName];
      }
      _.extend(entries, devHotConfig[taskTargetName].entry);
    });

    if (targetConfig) {
      targetConfig.entry = entries;
    }

    var config = {
      options: {
        webpack: targetConfig,
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
    // console.log(JSON.stringify(config))

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
