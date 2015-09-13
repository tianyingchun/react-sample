import request from 'superagent';
import WebAPI from '../../utils/WebAPI';
import lang from '../../utils/lang';

class Workspace extends WebAPI{
  loadWorkspaceItems = (workspaceId) => {
    console.log('service: loadWorkspaceItems', workspaceId);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { id:1, name:'new workspace item 1' },
          { id:2, name:'new workspace item 2' },
          { id:3, name:'new workspace item 3' },
          { id:4, name:'new workspace item 4' }
        ]);
      }, 5000);
    });
  }
}
export default Workspace;
