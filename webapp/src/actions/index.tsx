import * as constants from '../constants';

export interface RequestTournamentsRefresh {
  type: constants.REQUEST_TOURNAMENTS_REFRESH
}

export type Action = RequestTournamentsRefresh

export function requestTournamentsRefresh(): RequestTournamentsRefresh {
  return {
    type: constants.REQUEST_TOURNAMENTS_REFRESH
  }
}
