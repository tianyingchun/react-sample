import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import promiseMiddleware from '../../utils/promiseMiddleware';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger({
  level: 'log',
  collapsed: true,
  predicate: (getState, action) => "production" !== process.env.NODE_ENV
});

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware,
  loggerMiddleware
)(createStore);

// Creates a preconfigured store for this example.
export default function configureStore (initialState) {
  return createStoreWithMiddleware(rootReducer, initialState);
}
