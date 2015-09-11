import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-simple-promise';
import finalReducers from '../reducers';

const loggerMiddleware = createLogger({
  collapsed: false,
  predicate: (/*getState, action*/) => 'production' !== process.env.NODE_ENV
});

const finalCreateStore = applyMiddleware(
  promiseMiddleware(),
  loggerMiddleware
)(createStore);

// Creates a preconfigured store for this example.
export default function configureStore (initialState) {
  return finalCreateStore(finalReducers, initialState);
}
