import * as WsActionTypes from '../constants/WsActionTypes';
import WorkspaceService from '../services/Workspace';

let workspaceService = new WorkspaceService();

export function getExistedWsList (workspaceId) {
  return {
    type: WsActionTypes.GET_WS_LIST,
    payload: {
      promise: workspaceService.loadWorkspaceItems(workspaceId),
      workspaceId
    }
  };
}

