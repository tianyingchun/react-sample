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
    cdnRoot: 'http://cdn.adsponsor.com/front/'
  },
  projects: {
    workspace: {
      member: {
        entry: './workspace/app/member.js',
        version: '',
        js: ['workspace/member/${version}/bundle.common.js', 'workspace/member/${version}/bundle.js'],
        css: ['workspace/member/${version}/bundle.common.css', 'workspace/member/${version}/bundle.css']
      },
      setting: {
        entry: './workspace/app/setting.js',
        version: ''
      },
      wslist: {
        entry: './workspace/app/wslist.js',
        version: ''
      }
    }
  }
};
