import * as WsActionTypes from '../constants/WsActionTypes';

let initialState = [ {
  id: 1,
  name: 'workspace name, id: 1'
}, {
  id: 2,
  name: 'workspace name, id: 2'
} ];
export default function workspaces (state = initialState, action) {
  switch (action.type) {
    case WsActionTypes.GET_WS_LIST:
      var seed = state.length + 1;
      return [ {
        id: seed,
        name: 'new workspace name, id: ' + seed
      }, ...state ];
    default:
      return state;
  }
}
