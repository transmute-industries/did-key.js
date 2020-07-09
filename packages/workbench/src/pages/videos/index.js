import React from "react";
import { Videos as Page } from "./Videos";

import { compose } from "redux";

import wallet from "../../store/universal-wallet";

const container = compose(wallet.container);

export const Videos = container((props) => {
  return <Page {...props} />;
});
