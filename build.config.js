var path = require('path');
module.exports = {
  // the optional configurations.
  options: {
    devServer: {
      host: 'localhost',
      port: 3000,
      publicPath: 'http://localhost:3000/public/'
    },
    built: {
      // where the built files should be placed?
      baseDir: path.join(__dirname, 'public')
    },
    // assets public path (stylesheets,...)
    assets: {
      // the urlLoaderQuery used in buildtool/webpack.base.config.js <url-loader> config node.
      urlLoaderQuery: {
        context: '${projectName}/stylesheets',
        name: '${projectName}/[path][name].[ext]'
      },
      dev: 'http://localhost:3000/public/',
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
        entry: './workspace/app/member/index.js',
        routes: './workspace/app/member/routes.js',
        version: '', //maybe: cdn.xx.com/public/workspace/member/bundle.js?v=version
        jsBundles: ['browser-polyfill.js', 'reactkits.js', 'workspace/member/${version}/bundle.js'],
        cssBundles: ['workspace/member/${version}/bundle.css']
      },
      setting: {
        match: /^\/workspace\/s\/*/,
        entry: './workspace/app/setting/index.js',
        routes: './workspace/app/setting/routes.js',
        version: ''
      },
      wslist: {
        match: /^\/workspace\/list(\/)?$/,
        entry: './workspace/app/wslist/index.js',
        routes: './workspace/app/wslist/routes.js',
        version: '', // in mose case we don't need to specific version number.
        jsBundles: ['browser-polyfill.js', 'reactkits.js', 'workspace/wslist/${version}/bundle.js'],
        cssBundles: ['workspace/wslist/${version}/bundle.css']
      }
    }
  }
};
