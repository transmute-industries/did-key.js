import React from "react";
import { Resolver as Page } from "./Resolver";

import { compose } from "redux";

import wallet from "../../store/universal-wallet";

const container = compose(wallet.container);

export const Resolver = container((props) => {
  return <Page {...props} />;
});
