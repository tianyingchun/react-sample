import * as WsActionTypes from '../constants/WsActionTypes';

let initialState = [{
  id: 1,
  name: 'workspace name 1'
}, {
  id: 3,
  name: 'workspace name 2'
}];
export default function workspaces (state = initialState, action) {
  switch (action.type) {
    case WsActionTypes.GET_WS_LIST:
      return [{
        id: -1,
        name: 'new workspace name'
      }, ...state]
    default:
      return state;
  }
}
