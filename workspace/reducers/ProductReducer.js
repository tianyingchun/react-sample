const defaultState = [];

export default function productReducer (state = defaultState, action) {
  let finalState = null;
  switch (action.type) {
    case 'GET_PRODUCT':
      console.log(action);
      console.log(state);
      finalState = state.concat(action.res.data);
      break;
    default:
      finalState = state;
  }
  return finalState;
}
