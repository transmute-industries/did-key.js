import React from "react";
import { Home as Page } from "./Home";

import { compose } from "redux";

import wallet from "../../store/universal-wallet";

const container = compose(wallet.container);

export const Home = container((props) => {
  return <Page {...props} />;
});
