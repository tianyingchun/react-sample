var path = require('path');
module.exports = {
  // the optional configurations.
  options: {
    // the location related gruntfile of your projects root folder.
    // put web, admin into ./*
    projectRoot: './projects',

    devServer: {
      host: '172.16.233.137',
      port: 3000,
      publicPath: 'http://172.16.233.137:3000/public/'
    },
    built: {
      // where the built files should be placed?
      baseDir: path.join(__dirname, 'public')
    },
    // assets public path (stylesheets,...)
    assets: {
      // the urlLoaderQuery used in buildtool/webpack.base.config.js <url-loader> config node.
      urlLoaderQuery: {
        context: 'projects/${projectName}/stylesheets',
        name: '${projectName}/[path][name].[ext]'
      },
      dev: 'http://172.16.233.137:3000/public/',
      prod: 'http://cdn.xx.com/public/'
    }
  },
  projects: {
    // ${projectName}, project layers
    workspace: {
      // ${subProjectName}, it contains multi module in business domain.
      member: {
        // server rendering url matching.
        match: /^\/workspace\/m\/.*/,
        // entry point, must be string.
        entry: './projects/workspace/app/member/index.js',
        routes: './projects/workspace/app/member/routes.js',
        version: '', //maybe: cdn.xx.com/public/workspace/member/bundle.js?v=version
        jsBundles: ['browser-polyfill.js', 'reactkits.js', 'workspace/member/bundle.js${version}'],
        cssBundles: ['workspace/member/bundle.css${version}']
      },
      setting: {
        match: /^\/workspace\/s\/*/,
        entry: './projects/workspace/app/setting/index.js',
        routes: './projects/workspace/app/setting/routes.js',
        version: ''
      },
      wslist: {
        match: /^\/workspace\/list(\/)?$/,
        entry: './projects/workspace/app/wslist/index.js',
        routes: './projects/workspace/app/wslist/routes.js',
        version: '?2015', // in mose case we don't need to specific version number.
        jsBundles: ['browser-polyfill.js', 'reactkits.js', 'workspace/wslist/bundle.js${version}'],
        cssBundles: ['workspace/wslist/bundle.css${version}']
      }
    }
  }
};
