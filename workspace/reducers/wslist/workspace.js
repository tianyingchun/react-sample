import * as WsActionTypes from '../../constants/WsActionTypes';
import { resolve, reject } from 'redux-simple-promise';

let initialState = [ {
    "id": 1,
    "name": "workspace name 1"
  }, {
    "id": 2,
    "name": "workspace name 2"
  },
  {
    "id": 3,
    "name": "workspace name 3"
  },{
    "id": 4,
    "name": "workspace name 4"
  }
];
export function workspaces (state = initialState, action) {
  let list = Array.isArray(state) ? state : state.list;

  switch (action.type) {
  case WsActionTypes.GET_WS_LIST:
    console.log('action:',action)
    return Object.assign({}, { isLoading: true }, { list: initialState });

  case resolve(WsActionTypes.GET_WS_LIST):
    console.log('action resolve: ',action)

    return Object.assign({}, {
      isLoading: false,
      list: action.payload
    });

  case reject(WsActionTypes.GET_WS_LIST):
    return Object.assign({}, {
      isLoading: false,
      list: action.payload
    });

  default:
    return state;
  }
}

export function workspaceOthers (state = '', action) {

  switch (action.type) {
  case WsActionTypes.GET_WS_LIST:
    console.log('action:',action)

  case resolve(WsActionTypes.GET_WS_LIST):
    console.log('action resolve: ',action)

  case reject(WsActionTypes.GET_WS_LIST):

  default:
    return state;
  }
}
