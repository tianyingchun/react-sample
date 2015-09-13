import * as WsActionTypes from '../constants/WsActionTypes';
import WorkspaceService from '../services/Workspace';

let workspaceService = new WorkspaceService();

// simple default redux action, directly return object.
export function receiveWsList(wsList) {
  return {
    type: WsActionTypes.SHOW_WS_LIST,
    payload: wsList
  }
}

// promiseMiddleware usage.
export function getExistedWsList(workspaceId) {
  return {
    type: WsActionTypes.GET_WS_LIST,
    payload: {
      promise: workspaceService.loadWorkspaceItems(workspaceId),
      workspaceId
    }
  };
}

// thunkMiddleware usage.
export function getWsListAsync(workspaceId) {
  return (dispatch, getState) => {
    var currState = getState();
    console.log('current state:', currState);
    var workspaces = currState.workspaces;
    if(workspaces) {
      dispatch(receiveWsList(currState.workspaces.list));
    } else {
      return workspaceService.loadWorkspaceItems(workspaceId)
        .then(function (result) {
          console.log('result', result);
          dispatch(receiveWsList(result));
        })
    }
  };
}
