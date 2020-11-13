import React from "react";
import { Unextractable as Page } from "./Unextractable";

import { compose } from "redux";

import wallet from "../../store/universal-wallet";

const container = compose(wallet.container);

export const Unextractable = container((props) => {
  return <Page {...props} />;
});
