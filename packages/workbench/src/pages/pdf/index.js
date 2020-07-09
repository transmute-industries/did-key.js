import React from "react";

import { compose } from "redux";

import { OfflinePDF } from "./OfflinePDF";

import wallet from "../../store/universal-wallet";

const container = compose(wallet.container);

export const PdfDemo = container((props) => {
  return <OfflinePDF {...props} />;
});
