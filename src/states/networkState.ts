// import { NetworkState } from 'types/networkState.types';

import type { NetworkState } from '../types';

// Ref: https://html.spec.whatwg.org/multipage/media.html#network-states
export const NETWORK_STATE = Object.freeze({
  NETWORK_EMPTY: 0,
  NETWORK_IDLE: 1,
  NETWORK_LOADING: 2,
  NETWORK_NO_SOURCE: 3,
} as const);
