import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';
import finalModuleReducers from '../reducers';

const loggerMiddleware = createLogger({
  collapsed: false,
  predicate: (/*getState, action*/) => 'production' !== process.env.NODE_ENV
});

const finalCreateStore = applyMiddleware(
  promiseMiddleware(),
  thunkMiddleware,
  loggerMiddleware
)(createStore);

/**
 * Creates a preconfigured store for this example.
 * @param  {St} moduleName    the reducer module name
 * @param  {Any} initialState initialState values for reducer.
 * @return {Object}           store
 */
export default function configureStore (moduleName, initialState) {

  let moduleReducers = finalModuleReducers(moduleName);
  // store.
  let store = finalCreateStore(moduleReducers, initialState);

  // if (module.hot) {
  //   module.hot.accept('../reducers', () =>
  //     store.replaceReducer(moduleReducers)
  //   );
  // }

  return store;
}
