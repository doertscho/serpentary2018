import * as constants from '../constants';

export interface DoSomething {
  type: constants.DO_SOMETHING
}

export type Action = DoSomething

export function doSomething(): DoSomething {
  return {
    type: constants.DO_SOMETHING
  }
}
