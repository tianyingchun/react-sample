import * as MemberActionTypes from '../../constants/MemberActionTypes';
import { resolve, reject } from 'redux-simple-promise';

// reducer for member filter action types: [ 'all', 'reject', 'untreated' ]
export function membersFilterBy (state = 'all', action) {

  // all filter action types for member.
  let filterTypes = MemberActionTypes.filterTypes;

  switch (action.type) {

    case filterTypes.ALL:

      break;

    case filterTypes.REJECT:

      break;

    case filterTypes.UNTREATED:

      break;

    default:
      return state;

  }
}

// reducer for member inputbox search value 'searchText'
export function membersSearchBy (state = '', action) {

  switch (action.type) {
    case MemberActionTypes.SEARCH:

      break;

    default:
      return state;

  }
}
