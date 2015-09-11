const defaultState = [];

export default function products (state = defaultState, action) {
  let finalState = state;
  switch (action.type) {
    case 'GET_PRODUCT':
      finalState = action.res.data;
      break;
    default:
      finalState = state;
  }
  return finalState;
}
