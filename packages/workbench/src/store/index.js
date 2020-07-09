import { connectRouter } from "connected-react-router";

import history from "./history";

import wallet from "./universal-wallet";

export default {
  router: connectRouter(history),
  wallet: wallet.reducer,
};
