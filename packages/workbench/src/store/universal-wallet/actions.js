import { createAction } from 'redux-actions';

export const setUniversalWalletProp = createAction(
  'universal-wallet/SET_UNIVERSAL_WALLET_PROP',
  (payload) => payload
);
