import { combineReducers } from 'redux';
import * as filters from './filter';

const finalReducers = combineReducers({
  ...filters
});

export default finalReducers;
