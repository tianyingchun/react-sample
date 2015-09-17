import { createStore, applyMiddleware, compose } from 'redux';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import promiseMiddleware from 'redux-simple-promise';
import finalModuleReducers from '../reducers';

let loggerMiddleware = createLogger({
  collapsed: false,
  predicate: (/*getState, action*/) => 'production' !== process.env.NODE_ENV
});

// the production middlewares, performace optimazation.
let middlewares = [ promiseMiddleware(), thunkMiddleware ];
let finalCreateStore;

if ('production' === process.env.NODE_ENV) {
  // Production and broswer mode.
  finalCreateStore = applyMiddleware(...middlewares)(createStore);
} else if (typeof window !== 'undefined') {
  // Development and broswer mode
  finalCreateStore = compose (
    applyMiddleware(...middlewares, loggerMiddleware)
    // We can attach devtool panel in view components, if you want.
    // Note. devtools can't run ie8.
    // require('redux-devtools').devTools(),
    // require('redux-devtools').persistState(
    //   window.location.href.match(/[?&]debug_session=([^&]+)\b/)
    // )
  )(createStore);
} else {
  // for Node Env
  finalCreateStore = compose (
    applyMiddleware(...middlewares)
  )(createStore);
}


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
