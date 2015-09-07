module.exports = {
  // project name.
  workspace: {
    member: {
      entry: './workspace/app/member.js',
      version: ''
    },
    setting: {
      entry: './workspace/app/setting.js',
      version: ''
    },
    wslist: {
      entry: './workspace/app/wslist.js',
      version: ''
    }
  },
  // the default module name.
  default: {
    home: {
      entry: './workspace/app/member.js',
      version: ''
    }
  }
};