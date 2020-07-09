import { handleActions } from "redux-actions";
import { setUniversalWalletProp } from "./actions";

const initialState = {
  name: "UniversalWallet2020",
  status: "UNLOCKED",
  contents: [],
  vaultEndpoint: "https://edv.did.ai/edvs",
  isSyncEnabled: true,
  isSyncing: false,
};

export default handleActions(
  {
    [setUniversalWalletProp]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
  initialState
);
