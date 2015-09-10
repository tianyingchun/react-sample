const defaultState = [];

export default function productReducer (state = defaultState, action) {
  let finalState = null;
  switch (action.type) {
    case 'GET_PRODUCT':
      finalState = action.res.data;
      break;
    default:
      finalState = state;
  }
  return finalState;
}
