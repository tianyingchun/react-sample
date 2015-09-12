import request from 'superagent';
import WebAPI from '../../utils/WebAPI';

class Workspace extends WebAPI{
  loadWorkspaceItems = (workspaceId) => {
    console.log('service: loadWorkspaceItems', workspaceId);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          { id:1, name:'workspace item 1' },
          { id:2, name:'workspace item 2' },
          { id:3, name:'workspace item 3' }
        ]);
      }, 5000);
    });
  }
}
export default Workspace;
