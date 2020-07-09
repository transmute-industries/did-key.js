import React from 'react';
import { Workbench as Page } from './Workbench';

import { compose } from 'redux';

import wallet from '../../store/universal-wallet';

const container = compose(wallet.container);

export const Workbench = container((props) => {
  return <Page {...props} />;
});
