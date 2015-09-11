import { combineReducers } from 'redux';
import workspace from './workspace';

const finalReducers = combineReducers({
  workspaces: workspace
});

export default finalReducers;
