import { combineReducers } from 'redux';
import products from './products';
import workspaces from './workspace';

const finalReducers = combineReducers({
  products,
  workspaces
});

export default finalReducers;
