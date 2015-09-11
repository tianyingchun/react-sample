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
    workspace: {
      member: {
        entry: './workspace/app/member/index.js',
        version: '', //maybe: cdn.xx.com/public/workspace/member/bundle.js?v=version
        js: ['workspace/member/${version}/bundle.common.js', 'workspace/member/${version}/bundle.js'],
        css: ['workspace/member/${version}/bundle.common.css', 'workspace/member/${version}/bundle.css']
      },
      setting: {
        entry: './workspace/app/setting/index.js',
        version: ''
      },
      wslist: {
        entry: './workspace/app/wslist/index.js',
        version: ''
      }
    }
  }
};
